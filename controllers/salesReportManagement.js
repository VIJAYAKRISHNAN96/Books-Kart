

const { now } = require("mongoose");
const Order= require("../model/orderModel");

const PDFDocument = require('pdfkit-table');
const fs = require("fs");
const XLSX = require('xlsx');
// const path = require("path");


const salesReportManagement = {

     generatePDF : async (filterCondition, res, page, perPage) => {
        const allOrders = await Order.find(filterCondition);
        const totalSalesAmount = allOrders.reduce((acc, order) => acc + order.billTotal, 0);
        const totalDiscount = allOrders.reduce((acc, order) => acc + (order.couponAmount || 0), 0);
        const salesCount = allOrders.length;
      
        const orders = await Order.find(filterCondition)
          .populate('user')
          .populate('items.productId')
          .populate('couponId')
          .skip((page - 1) * perPage)
          .limit(perPage);
      
        console.log('filter check', orders);
      
        const doc = new PDFDocument({ margin: 30, size: 'A4', layout: 'landscape' });
        const filename = 'Sales_Report.pdf';
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      
        doc.pipe(res);
      
        // Header
        doc.font('Helvetica-Bold').fontSize(20).text('Sales Report', { align: 'center' });
        doc.fontSize(12).text(`Generated on: ${new Date().toLocaleString('en-IN')}`, { align: 'right' });
        doc.moveDown(2);
      
        // Table Headers
        const headers = [
          'Date',
          'Order No.',
          'Customer',
          'Products',
          'Quantity Sold',
          'Price',
          'Discount Amount',
          'Total Price',
        ];
      
        const rows = orders.map((order) => [
          new Date(order.orderDate).toLocaleString('en-IN'),
          order.orderId,
          order.user.name,
          order.items.map((item) => item.productId.name).join(', '),
          order.items.map((item) => item.quantity).join(', '),
          order.items.map((item) => item.productPrice.toFixed(2)).join(', '),
          order.couponAmount ? order.couponAmount.toFixed(2) : '0.00',
          order.billTotal.toFixed(2),
        ]);
      
        // Draw Table
        doc.table({
          headers,
          rows,
        }, {
          prepareHeader: () => doc.font('Helvetica-Bold').fontSize(10),
          prepareRow: (row, i) => {
            doc.font('Helvetica').fontSize(8);
            if (i % 2 === 0) {
              doc.fillColor('#f0f0f0').rect(doc.x, doc.y, doc.page.width - doc.x - 30, doc.currentLineHeight()).fill();
            }
            doc.fillColor('#000000');
          },
          padding: 5,
          columnSpacing: 5,
          width: doc.page.width - 60,
          x: 30,
          columnWidths: [80, 70, 80, 150, 60, 80, 70, 70],
          align: ['left', 'left', 'left', 'left', 'right', 'right', 'right', 'right'],
        });
      
        // Summary Section
        doc.addPage()
          .font('Helvetica-Bold').fontSize(16).text('Sales Summary', { align: 'center' })
          .moveDown()
          .font('Helvetica').fontSize(12)
          .text(`Total Sales Count: ${salesCount}`, { align: 'left' })
          .text(`Total Sales Amount: ${totalSalesAmount.toFixed(2)}`, { align: 'right' })
          .text(`Total Discount Amount: ${totalDiscount.toFixed(2)}`, { align: 'right' });
      
        doc.end();
      },
      

      downloadPDF : async (req, res) => {
        try {
          const { filterType, startDate, endDate,page } = req.query;
          const perPage=6;
          const now = new Date();
          let filterCondition = { orderStatus: "Delivered" };
          console.log("pdf check",filterType);
          console.log("start:",startDate);
          console.log("end:",endDate);
          // Define filter conditions based on the filterType
          if (filterType === "daily") {
            const today = new Date(now.setHours(0, 0, 0, 0));
            filterCondition.orderDate = { $gte: today };
          } else if (filterType === "weekly") {
            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - now.getDay());
            startOfWeek.setHours(0, 0, 0, 0);
            filterCondition.orderDate = { $gte: startOfWeek };
          } else if (filterType === "monthly") {
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            filterCondition.orderDate = { $gte: startOfMonth };
          } else if (filterType === "yearly") {
            const startOfYear = new Date(now.getFullYear(), 0, 1);
            filterCondition.orderDate = { $gte: startOfYear };
          } else if (filterType === "filter" && startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            if (start.getTime() === end.getTime()) {
              filterCondition.orderDate = {
                $gte: start,
                $lt: new Date(start.getTime() + 24 * 60 * 60 * 1000),
              };
            } else {
              filterCondition.orderDate = {
                $gte: start,
                $lte: end,
              };
            }
          }
      
          // Generate the PDF
          await salesReportManagement. generatePDF(filterCondition, res,page,perPage);
        } catch (error) {
          console.log(error.message);
          res.status(500).json({ error: error.message });
        }
      },


  generateExcel: async (filterCondition, res, page, perPage) => {
    try {
      const allOrders = await Order.find(filterCondition);
      const totalSalesAmount = allOrders.reduce((acc, order) => acc + order.billTotal, 0);
      const totalDiscount = allOrders.reduce((acc, order) => acc + (order.couponAmount || 0), 0);
      const salesCount = allOrders.length;

      const orders = await Order.find(filterCondition)
        .populate('user')
        .populate('items.productId')
        .populate('couponId')
        .skip((page - 1) * perPage)
        .limit(perPage);

      const data = [
        ['Date', 'Order No.', 'Customer', 'Products', 'Quantity Sold', 'Price', 'Discount Amount', 'Total Price'],
        ...orders.map((order) => [

            new Date(order.orderDate).toLocaleString('en-IN'),
            order.orderId,
            order.user.name,
            order.items.map((item) => item.productId.name).join(', '),
            order.items.map((item) => item.quantity).join(', '),
            order.items.map((item) => item.productPrice.toFixed(2)).join(', '),
            order.couponAmount ? order.couponAmount.toFixed(2) : '0.00',
            order.billTotal.toFixed(2),






        //   new Date(order.orderDate).toLocaleString('en-IN'),
        //   order.orderId,
        //   order.user.name,
        //   order.items.map((item) => item.productId.title).join(', '),
        //   order.items.map((item) => item.quantity).join(', '),
        //   order.items.map((item) => item.productPrice.toFixed(2)).join(', '),
        //   order.couponAmount ? order.couponAmount.toFixed(2) : '0.00',
        //   order.billTotal.toFixed(2),

        ]),
        [],
        ['', '', '', '', '', '', 'Total Sales Count:', salesCount],
        ['', '', '', '', '', '', 'Total Sales Amount:', totalSalesAmount.toFixed(2)],
        ['', '', '', '', '', '', 'Total Discount Amount:', totalDiscount.toFixed(2)],
      ];

      const worksheet = XLSX.utils.aoa_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sales Report');

      const filename = 'sales_report.xlsx';
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

      const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
      res.send(buffer);
    } catch (error) {
      console.error('Error generating Excel:', error);
      res.status(500).send("Error generating Excel");
    }
  },

  loadSalesReport: async (req, res) => {
    try {
      const perPage = 6;
      const page = parseInt(req.query.page) || 1;

      const deliveredOrders = await Order.find({ orderStatus: "Delivered" })
        .populate("user")
        .populate("items.productId")
        .populate("couponId")
        .sort({ orderDate: -1 })
        .skip((page - 1) * perPage)
        .limit(perPage);

      const totalOrders = await Order.countDocuments({ orderStatus: "Delivered" });
      const totalPages = Math.ceil(totalOrders / perPage);

      const allDeliveredOrders = await Order.find({ orderStatus: "Delivered" });
      const totalSalesCount = allDeliveredOrders.length;
      const totalDiscountAmount = allDeliveredOrders.reduce((acc, order) => acc + (order.couponAmount || 0), 0);
      const totalSalesAmount = allDeliveredOrders.reduce((acc, order) => acc + order.billTotal, 0);

      res.render("salesReport", {
        order: deliveredOrders,
        currentPage: page,
        totalPages: totalPages,
        totalSalesCount: totalSalesCount,
        totalDiscountAmount: totalDiscountAmount.toFixed(2),
        totalSalesAmount: totalSalesAmount.toFixed(2),
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Error loading sales report");
    }
  },

  filterSalesReport: async (req, res) => {
    try {
      const { filterType, startDate, endDate, page = 1 } = req.query;
      const perPage = 6;
      const now = new Date();
      let filterCondition = { orderStatus: "Delivered" };

      if (filterType === "daily") {
        const today = new Date(now.setHours(0, 0, 0, 0));
        filterCondition.orderDate = { $gte: today };
      } else if (filterType === "weekly") {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        filterCondition.orderDate = { $gte: startOfWeek };
      } else if (filterType === "monthly") {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        filterCondition.orderDate = { $gte: startOfMonth };
      } else if (filterType === "yearly") {
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        filterCondition.orderDate = { $gte: startOfYear };
      } else if (filterType === "filter" && startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (start.getTime() === end.getTime()) {
          filterCondition.orderDate = {
            $gte: start,
            $lt: new Date(start.getTime() + 24 * 60 * 60 * 1000),
          };
        } else {
          filterCondition.orderDate = {
            $gte: start,
            $lte: end,
          };
        }
      }

      const allOrders = await Order.find(filterCondition);
      const totalSalesAmount = allOrders.reduce((acc, order) => acc + order.billTotal, 0);
      const totalDiscount = allOrders.reduce((acc, order) => acc + (order.couponAmount || 0), 0);
      const salesCount = allOrders.length;

      const totalOrders = allOrders.length;
      const totalPages = Math.ceil(totalOrders / perPage);

      const deliveredOrders = await Order.find(filterCondition)
        .populate("user")
        .populate("items.productId")
        .populate("couponId")
        .skip((page - 1) * perPage)
        .limit(perPage);

      res.render("salesReport", {
        order: deliveredOrders,
        currentPage: page,
        totalPages: totalPages,
        totalSalesCount: salesCount,
        totalDiscountAmount: totalDiscount.toFixed(2),
        totalSalesAmount: totalSalesAmount.toFixed(2),
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Error filtering sales report");
    }
  },











  downloadExcel: async (req, res) => {
    try {
      const { filterType, startDate, endDate, page = 1 } = req.query;
      const perPage = 6;

      const now = new Date();
      let filterCondition = { orderStatus: "Delivered" };

      if (filterType === "daily") {
        const today = new Date(now.setHours(0, 0, 0, 0));
        filterCondition.orderDate = { $gte: today };
      } else if (filterType === "weekly") {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        filterCondition.orderDate = { $gte: startOfWeek };
      } else if (filterType === "monthly") {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        filterCondition.orderDate = { $gte: startOfMonth };
      } else if (filterType === "yearly") {
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        filterCondition.orderDate = { $gte: startOfYear };
      } else if (filterType === "filter" && startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (start.getTime() === end.getTime()) {
          filterCondition.orderDate = {
            $gte: start,
            $lt: new Date(start.getTime() + 24 * 60 * 60 * 1000),
          };
        } else {
          filterCondition.orderDate = {
            $gte: start,
            $lte: end,
          };
        }
      }

      await salesReportManagement.generateExcel(filterCondition, res, parseInt(page), perPage);
    } catch (error) {
      console.error("Error in downloadExcel:", error);
      res.status(500).send("Error generating Excel");
    }
  },
};

module.exports = salesReportManagement;
