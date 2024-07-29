<%-include("../partials/header.ejs")%>    

<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">

<link href="https://stackpath.bootstrapcdn.com/bootstrap/5.1.0/css/bootstrap.min.css" rel="stylesheet">

<script src="https://checkout.razorpay.com/v1/checkout.js"></script>


<style>
    .coupon-option {
        display: flex;
        align-items: center;
        margin-bottom: 0.5rem;
    }

    .coupon-option input[type="radio"] {
        width: auto;
        margin-right: 0.5rem;
    }

    .coupon-option label {
        margin: 0;
    }
</style>

<!-- <div class="modal fade" id="applyCouponModal" tabindex="-1" aria-labelledby="applyCouponModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="applyCouponModalLabel">Apply Coupon</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="couponForm">
                    <div class="mb-3">
                      
                        <label class="form-check-label">Select a coupon:</label>
                        <%  coupon.forEach((coup)=>{ %>
                          <div class="coupon-option">
                            <input type="radio"  name="coupon" value="<%=coup._id %>" class="form-check-input">
                            <label  class="form-check-label"><%=coup.couponname%> - <%=coup.discountamount%>% Off</label>
                        </div>
                       
                        <%})%>
                        
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary" id="applyCouponBtnModal">Apply Coupon</button>
            </div>
        </div>
    </div>
</div> -->


<div class="modal fade" id="applyCouponModal" tabindex="-1" aria-labelledby="applyCouponModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="applyCouponModalLabel">Apply Coupon</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="couponForm">
                    <div class="mb-3">
                      
                        <label class="form-check-label">Select a coupon:</label>
                        <%  coupon.forEach((coup)=>{ %>

                            <div class="form-check">
                                <input type="radio" name="coupon" value="<%= coup._id %>" class="form-check-input" id="coupon<%= coup._id %>">
                                <label class="form-check-label" for="coupon<%= coup._id %>"><%= coup.couponname %> - <%= coup.discountamount %>% Off</label>
                            </div>


                          <!-- <div class="coupon-option">
                            <input type="radio"  name="coupon" value="<%=coup._id %>" class="form-check-input">
                            <label  class="form-check-label"><%=coup.couponname%> - <%=coup.discountamount%>% Off</label>
                        </div> -->
                       
                        <%})%>
                        
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary" id="applyCouponBtnModal">Apply Coupon</button>
            </div>
        </div>
    </div>
</div>








<div class="mobile-header-active mobile-header-wrapper-style">
    <div class="mobile-header-wrapper-inner">
        <div class="mobile-header-top">
            <div class="mobile-header-logo">
                <a href="index.html"><img src="userAssets/imgs/theme/logo.svg" alt="logo"></a>
            </div>
            <div class="mobile-menu-close close-style-wrap close-style-position-inherit">
                <button class="close-style search-close">
                    <i class="icon-top"></i>
                    <i class="icon-bottom"></i>
                </button>
            </div>
        </div>
        
        <div class="mobile-header-content-area">
            <div class="mobile-search search-style-3 mobile-header-border">
                <form action="#">
                    <input type="text" placeholder="Search for items…">
                    <button type="submit"><i class="fi-rs-search"></i></button>
                </form>
            </div>
            <div class="mobile-menu-wrap mobile-header-border">
                <div class="main-categori-wrap mobile-header-border">
                    <a class="categori-button-active-2" href="#">
                        <span class="fi-rs-apps"></span> Browse Categories
                    </a>
                    <div class="categori-dropdown-wrap categori-dropdown-active-small">
                        <ul>
                            <li><a href="shop-grid-right.html"><i class="evara-font-dress"></i>Women's Clothing</a></li>
                            <li><a href="shop-grid-right.html"><i class="evara-font-tshirt"></i>Men's Clothing</a></li>
                            <li> <a href="shop-grid-right.html"><i class="evara-font-smartphone"></i> Cellphones</a></li>
                            <li><a href="shop-grid-right.html"><i class="evara-font-desktop"></i>Computer & Office</a></li>
                            <li><a href="shop-grid-right.html"><i class="evara-font-cpu"></i>Consumer Electronics</a></li>
                            <li><a href="shop-grid-right.html"><i class="evara-font-home"></i>Home & Garden</a></li>
                            <li><a href="shop-grid-right.html"><i class="evara-font-high-heels"></i>Shoes</a></li>
                            <li><a href="shop-grid-right.html"><i class="evara-font-teddy-bear"></i>Mother & Kids</a></li>
                            <li><a href="shop-grid-right.html"><i class="evara-font-kite"></i>Outdoor fun</a></li>
                        </ul>
                    </div>
                </div>
                <!-- mobile menu start -->
                <nav>
                    <ul class="mobile-menu">
                        <li class="menu-item-has-children"><span class="menu-expand"></span><a href="index.html">Home</a>
                            <ul class="dropdown">
                                <li><a href="index.html">Home 1</a></li>
                                <li><a href="index-2.html">Home 2</a></li>
                                <li><a href="index-3.html">Home 3</a></li>
                                <li><a href="index-4.html">Home 4</a></li>
                            </ul>
                        </li>
                        <li class="menu-item-has-children"><span class="menu-expand"></span><a href="shop-grid-right.html">shop</a>
                            <ul class="dropdown">
                                <li><a href="shop-grid-right.html">Shop Grid – Right Sidebar</a></li>
                                <li><a href="shop-grid-left.html">Shop Grid – Left Sidebar</a></li>
                                <li><a href="shop-list-right.html">Shop List – Right Sidebar</a></li>
                                <li><a href="shop-list-left.html">Shop List – Left Sidebar</a></li>
                                <li><a href="shop-fullwidth.html">Shop - Wide</a></li>
                                <li class="menu-item-has-children"><span class="menu-expand"></span><a href="#">Single Product</a>
                                    <ul class="dropdown">
                                        <li><a href="shop-product-right.html">Product – Right Sidebar</a></li>
                                        <li><a href="shop-product-left.html">Product – Left Sidebar</a></li>
                                        <li><a href="shop-product-full.html">Product – No sidebar</a></li>
                                    </ul>
                                </li>
                                <li><a href="shop-filter.html">Shop – Filter</a></li>
                                <li><a href="shop-wishlist.html">Shop – Wishlist</a></li>
                                <li><a href="shop-cart.html">Shop – Cart</a></li>
                                <li><a href="shop-checkout.html">Shop – Checkout</a></li>
                                <li><a href="shop-compare.html">Shop – Compare</a></li>
                            </ul>
                        </li>
                        <li class="menu-item-has-children"><span class="menu-expand"></span><a href="#">Mega menu</a>
                            <ul class="dropdown">
                                <li class="menu-item-has-children"><span class="menu-expand"></span><a href="#">Women's Fashion</a>
                                    <ul class="dropdown">
                                        <li><a href="shop-product-right.html">Dresses</a></li>
                                        <li><a href="shop-product-right.html">Blouses & Shirts</a></li>
                                        <li><a href="shop-product-right.html">Hoodies & Sweatshirts</a></li>
                                        <li><a href="shop-product-right.html">Women's Sets</a></li>
                                    </ul>
                                </li>
                                <li class="menu-item-has-children"><span class="menu-expand"></span><a href="#">Men's Fashion</a>
                                    <ul class="dropdown">
                                        <li><a href="shop-product-right.html">Jackets</a></li>
                                        <li><a href="shop-product-right.html">Casual Faux Leather</a></li>
                                        <li><a href="shop-product-right.html">Genuine Leather</a></li>
                                    </ul>
                                </li>
                                <li class="menu-item-has-children"><span class="menu-expand"></span><a href="#">Technology</a>
                                    <ul class="dropdown">
                                        <li><a href="shop-product-right.html">Gaming Laptops</a></li>
                                        <li><a href="shop-product-right.html">Ultraslim Laptops</a></li>
                                        <li><a href="shop-product-right.html">Tablets</a></li>
                                        <li><a href="shop-product-right.html">Laptop Accessories</a></li>
                                        <li><a href="shop-product-right.html">Tablet Accessories</a></li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                        <li class="menu-item-has-children"><span class="menu-expand"></span><a href="blog-category-fullwidth.html">Blog</a>
                            <ul class="dropdown">
                                <li><a href="blog-category-grid.html">Blog Category Grid</a></li>
                                <li><a href="blog-category-list.html">Blog Category List</a></li>
                                <li><a href="blog-category-big.html">Blog Category Big</a></li>
                                <li><a href="blog-category-fullwidth.html">Blog Category Wide</a></li>
                                <li class="menu-item-has-children"><span class="menu-expand"></span><a href="#">Single Product Layout</a>
                                    <ul class="dropdown">
                                        <li><a href="blog-post-left.html">Left Sidebar</a></li>
                                        <li><a href="blog-post-right.html">Right Sidebar</a></li>
                                        <li><a href="blog-post-fullwidth.html">No Sidebar</a></li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                        <li class="menu-item-has-children"><span class="menu-expand"></span><a href="#">Pages</a>
                            <ul class="dropdown">
                                <li><a href="page-about.html">About Us</a></li>
                                <li><a href="page-contact.html">Contact</a></li>
                                <li><a href="page-account.html">My Account</a></li>
                                <li><a href="page-login-register.html">login/register</a></li>
                                <li><a href="page-purchase-guide.html">Purchase Guide</a></li>
                                <li><a href="page-privacy-policy.html">Privacy Policy</a></li>
                                <li><a href="page-terms.html">Terms of Service</a></li>
                                <li><a href="page-404.html">404 Page</a></li>
                            </ul>
                        </li>
                        <li class="menu-item-has-children"><span class="menu-expand"></span><a href="#">Language</a>
                            <ul class="dropdown">
                                <li><a href="#">English</a></li>
                                <li><a href="#">French</a></li>
                                <li><a href="#">German</a></li>
                                <li><a href="#">Spanish</a></li>
                            </ul>
                        </li>
                    </ul>
                </nav>
                <!-- mobile menu end -->
            </div>
            <div class="mobile-header-info-wrap mobile-header-border">
                <div class="single-mobile-header-info mt-30">
                    <a  href="page-contact.html"> Our location </a>
                </div>
                <div class="single-mobile-header-info">
                    <a href="page-login-register.html">Log In / Sign Up </a>
                </div>
                <div class="single-mobile-header-info">
                    <a href="#">(+01) - 2345 - 6789 </a>
                </div>
            </div>
            <div class="mobile-social-icon">
                <h5 class="mb-15 text-grey-4">Follow Us</h5>
                <a href="#"><img src="userAssets/imgs/theme/icons/icon-facebook.svg" alt=""></a>
                <a href="#"><img src="userAssets/imgs/theme/icons/icon-twitter.svg" alt=""></a>
                <a href="#"><img src="userAssets/imgs/theme/icons/icon-instagram.svg" alt=""></a>
                <a href="#"><img src="userAssets/imgs/theme/icons/icon-pinterest.svg" alt=""></a>
                <a href="#"><img src="userAssets/imgs/theme/icons/icon-youtube.svg" alt=""></a>
            </div>
        </div>
    </div>


    <!-- <div class="modal fade" id="applyCouponModal" tabindex="-1" aria-labelledby="applyCouponModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="applyCouponModalLabel">Apply Coupon</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="couponForm">
                        <div class="mb-3">
                          
                            <label class="form-check-label">Select a coupon:</label>
                            <%  coupon.forEach((coup)=>{ %>
                              <div class="coupon-option">
                                <input type="radio"  name="coupon" value="<%=coup._id %>" class="form-check-input">
                                <label  class="form-check-label"><%=coup.couponname%> - <%=coup.discountamount%>% Off</label>
                            </div>
                           
                            <%})%>
                            
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" id="applyCouponBtnModal">Apply Coupon</button>
                </div>
            </div>
        </div>
    </div> -->

    <div class="modal fade" id="applyCouponModal" tabindex="-1" aria-labelledby="applyCouponModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="applyCouponModalLabel">Apply Coupon</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="couponForm">
                        <div class="mb-3">
                            <label class="form-check-label">Select a coupon:</label>
                            <% coupon.forEach((coup) => { %>
                                <div class="coupon-option">
                                    <input type="radio" name="coupon" value="<%= coup._id %>" class="form-check-input">
                                    <label class="form-check-label"><%= coup.couponname %> - <%= coup.discountamount %>% Off</label>
                                </div>
                            <% }) %>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" id="applyCouponBtnModal">Apply Coupon</button>
                </div>
            </div>
        </div>
    </div>





</div><div class="modal fade" id="addAddressModal" tabindex="-1" aria-labelledby="addAddressModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="addAddressModalLabel">Add Address</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="addAddressForm">
                    <div class="mb-3">
                        <label for="houseName" class="form-label">House Name:</label>
                        <input type="text" class="form-control" id="houseName" required>
                        <div id="houseNameError" class="error-message text-danger"></div>
                    </div>
                    <div class="mb-3">
                        <label for="street" class="form-label">Street:</label>
                        <input type="text" class="form-control" id="street" required>
                        <div id="streetError" class="error-message text-danger"></div>
                    </div>
                    <div class="mb-3">
                        <label for="city" class="form-label">City:</label>
                        <input type="text" class="form-control" id="city" required>
                        <div id="cityError" class="error-message text-danger"></div>
                    </div>
                    <div class="mb-3">
                        <label for="state" class="form-label">State:</label>
                        <input type="text" class="form-control" id="state" required>
                        <div id="stateError" class="error-message text-danger"></div>
                    </div>
                    <div class="mb-3">
                        <label for="country" class="form-label">Country:</label>
                        <input type="text" class="form-control" id="country" required>
                        <div id="countryError" class="error-message text-danger"></div>
                    </div>
                    <div class="mb-3">
                        <label for="postalCode" class="form-label">Postal Code:</label>
                        <input type="text" class="form-control" id="postalCode" required>
                        <div id="postalCodeError" class="error-message text-danger"></div>
                    </div>
                    <div class="mb-3">
                        <label for="phoneNo" class="form-label">Phone No:</label>
                        <input type="text" class="form-control" id="phoneNo" required>
                        <div id="phoneNoError" class="error-message text-danger"></div>
                    </div>
                    <div class="mb-3">
                        <label for="addressType" class="form-label">Address Type:</label><br>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="addressType" id="office" value="office">
                            <label class="form-check-label" for="office">Office</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="addressType" id="home" value="home">
                            <label class="form-check-label" for="home">Home</label>
                        </div>
                        <div id="addressTypeError" class="error-message text-danger"></div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" id="closeModalBtn">Close</button>
                <button type="button" class="btn btn-primary" onclick="validateAddress()">Save Address</button>
            </div>
        </div>
    </div>
</div>




<main class="main">
    <div class="page-header breadcrumb-wrap">
        <div class="container">
            <div class="breadcrumb">
                <a href="index.html" rel="nofollow">Home</a>
                <span></span> Shop
                <span></span> Checkout
            </div>
        </div>
    </div>
    <section class="mt-50 mb-50">
        <div class="container">
            <div class="row">
                <div class="col-lg-6 mb-sm-15">
                    <!-- <div class="toggle_info">
                        <span><i class="fi-rs-user mr-10"></i><span class="text-muted">Already have an account?</span> <a href="#loginform" data-bs-toggle="collapse" class="collapsed" aria-expanded="false">Click here to login</a></span>
                    </div> -->
                    <!-- <div class="panel-collapse collapse login_form" id="loginform">
                        <div class="panel-body">
                            <p class="mb-30 font-sm">If you have shopped with us before, please enter your details below. If you are a new customer, please proceed to the Billing &amp; Shipping section.</p>
                            <form method="post">
                                <div class="form-group">
                                    <input type="text" name="email" placeholder="Username Or Email">
                                </div>
                                <div class="form-group">
                                    <input type="password" name="password" placeholder="Password">
                                </div>
                                <div class="login_footer form-group">
                                    <div class="chek-form">
                                        <div class="custome-checkbox">
                                            <input class="form-check-input" type="checkbox" name="checkbox" id="remember" value="">
                                            <label class="form-check-label" for="remember"><span>Remember me</span></label>
                                        </div>
                                    </div>
                                    <a href="#">Forgot password?</a>
                                </div>
                                <div class="form-group">
                                    <button class="btn btn-md" name="login">Log in</button>
                                </div>
                            </form>
                        </div>
                    </div> -->
                </div>
                <div class="col-lg-6">
                    <!-- <div class="toggle_info">
                        <span><i class="fi-rs-label mr-10"></i><span class="text-muted">Have a coupon?</span> <a href="#coupon" data-bs-toggle="collapse" class="collapsed" aria-expanded="false">Click here to enter your code</a></span>
                    </div>
                    <div class="panel-collapse collapse coupon_form " id="coupon">
                        <div class="panel-body">
                            <p class="mb-30 font-sm">If you have a coupon code, please apply it below.</p>
                            <form method="post">
                                <div class="form-group">
                                    <input type="text" placeholder="Enter Coupon Code...">
                                </div>
                                <div class="form-group">
                                    <button class="btn  btn-md" name="login">Apply Coupon</button>
                                </div>
                            </form>
                        </div>
                    </div> -->
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <div class="divider mt-50 mb-50"></div>
                </div>
            </div>

            <!-- <div class="row">
                <% if (user.address && Array.isArray(user.address)) { %>
                    <% user.address.forEach(function(add, index) { %>
                        <div class="col-lg-6 mt-15">
                            <div class="card mb-3 mb-lg-0">
                                <div class="card-header d-flex justify-content-between align-items-center">
                                    <h5 class="mb-0"><%= add.type %> Address</h5>
                                    <div class="form-check">
                                        <input class="form-check-input" type="radio" name="selectedAddress" id="address<%= index %>" value="<%= index %>">
                                    </div>
                                </div>
                                <div class="card-body">
                                    <address>
                                        <%= add.houseName %><br>
                                        <%= add.street %>,<br>
                                        <%= add.city %>, <%= add.postalCode %><br>
                                        <%= add.phoneNumber %><br>
                                        <%= add.state %>
                                    </address>
                                    <p><%= add.country %></p>
                                </div>
                            </div>
                        </div>
                    <% }); %>
                <% } else { %>
                    <p>No addresses found.</p>
                <% } %>
            </div> -->
            

            <!-- <div class="row">
                <% user.address.forEach(function(add, index) { %>
                    <div class="col-lg-6 mt-15">
                        <div class="card mb-3 mb-lg-0">
                            <div class="card-header d-flex justify-content-between align-items-center">
                                <h5 class="mb-0"><%= add.type %> Address</h5>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="selectedAddress" id="address<%= index %>" value="<%= index %>">
                                </div>
                            </div>
                            <div class="card-body">
                                <address>
                                    <%= add.houseName %><br>
                                    <%= add.street %>,<br>
                                    <%= add.city %>, <%= add.postalCode %><br>
                                    <%= add.phoneNumber %><br>
                                    <%= add.state %>
                                </address>
                                <p><%= add.country %></p>
                            </div>
                        </div>
                    </div>
                <% }); %>
            </div> -->


            <div class="row">
                <div class="col-md-6">
                    <div class="mb-25">
                        <h4>Billing Details</h4>
                    </div>

                    <!-- <button id="openAddressModalButton" class="btn btn-primary">Add Address</button> -->

                    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addAddressModal">
                        Add Address
                    </button>


                    <!-- <div class="text-end mb-3">
                        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addAddressModal" style="background-color: #FF6B6B; border-color:  #FF6B6B;">Add Address</button>
                    </div> -->
                    <div class="row">
                        <% if (user.address && Array.isArray(user.address)) { %>
                            <% user.address.forEach(function(add, index) { %>
                                <div class="col-lg-6 mt-15">
                                    <div class="card mb-3 mb-lg-0">
                                        <div class="card-header d-flex justify-content-between align-items-center">
                                            <h5 class="mb-0"><%= add.type %> Address</h5>
                                            <div class="form-check">
                                                <input class="form-check-input" type="radio" name="selectedAddress" id="address<%= index %>" value="<%= index %>">
                                            </div>
                                        </div>
                                        <div class="card-body">
                                            <address>
                                                <%= add.houseName %><br>
                                                <%= add.street %>,<br>
                                                <%= add.city %>, <%= add.postalCode %><br>
                                                <%= add.phoneNumber %><br>
                                                <%= add.state %>
                                            </address>
                                            <p><%= add.country %></p>
                                        </div>
                                    </div>
                                </div>
                            <% }); %>
                        <% } else { %>
                            <p>No addresses found.</p>
                        <% } %>
                    </div>
                   
                </div>
                <div class="col-md-6">
                    <div class="order_review">
                        <div class="mb-20">
                            <h4>Your Orders</h4>
                        </div>
                        <div class="table-responsive order_table text-center">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th colspan="2">Product</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>

                                <tbody id="cart-items">
                                    <% let totalAmount = 0; %>
                                    <% if (cart && cart.product && Array.isArray(cart.product)) { %>
                                        <% cart.product.forEach(item => { %>
                                            <% 
                                                let itemTotal = item.productId.discountPrice ? item.productId.discountPrice * item.quantity : item.productId.price * item.quantity; 
                                                totalAmount += itemTotal; 
                                            %>
                                            <tr>
                                                <td class="image product-thumbnail">
                                                    <img src="/userAssets/imgs/shop/<%= item.productId.images[0] %>" alt="Product Image">
                                                </td>
                                                <td>
                                                    <h5><a href="shop-product-full.html"><%= item.productId.name %></a></h5>
                                                    <span class="product-qty">x<%= item.quantity %></span>
                                                </td>
                                                <td class="prod_price">$<span class="item-price"><%= itemTotal.toFixed(2) %></span></td>
                                            </tr>
                                        <% }); %>
                                    <% } %>
                                    <tr>
                                        <th>SubTotal</th>
                                        <td class="product-subtotal" colspan="2">$<span id="subtotal"><%= totalAmount.toFixed(2) %></span></td>
                                    </tr>
                                    <tr>
                                        <th>Shipping</th>
                                        <td colspan="2"><em>Free Shipping</em></td>
                                    </tr>
                                    <tr>
                                        <th>Total</th>
                                        <td colspan="2" class="product-subtotal"><span class="font-xl text-brand fw-900">$<span id="total"><%= totalAmount.toFixed(2) %></span></span></td>
                                    </tr>
                                    <tr>
                                        <!-- <td colspan="3" class="text-right">
                                            <button type="button" class="btn btn-primary" id="applyCouponBtn">Add Coupon</button>
                                            <button type="button" class="btn btn-danger" id="removeCouponBtn" disabled>Remove Coupon</button>
                                        </td> -->


                                        <!-- <td colspan="3" class="text-right">
                                            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#applyCouponModal">Add Coupon</button>

                                            <- <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#applyCouponModal">Add Coupon</button> -->
                                        <!-- </td>  -->
                                    </tr>

                                </tbody>
                                
                               
                               
                            </table>
                        </div> <button class="btn btn-fill-out mt-2" id="applyCouponBtn" style="background-color: #557775; border-color:  #15f43aba;">Add Coupon</button>
                        <button class="btn btn-fill-out mt-2" id="removeCouponBtn" disabled style="background-color: #557775; border-color:  #557775;">Remove Coupon</button>

                        <div class="bt-1 border-color-1 mt-30 mb-30"></div>
                        <div class="payment_method">
                            <div class="mb-25">
                                <h5>Payment Method</h5>
                            </div>
                            <div class="payment_option">
                                <div class="custome-radio">
                                    <input class="form-check-input" required type="radio" name="payment_option" id="exampleRadios5" value="razorpay">
                                    <label class="form-check-label" for="exampleRadios5">Razorpay</label>
                                    <div class="form-group collapse in" id="paypal">
                                        <p class="text-muted mt-5">Pay via Razorpay; you can pay with your credit card if you don't have a Razorpay account.</p>
                                    </div>
                                </div>
                                <div class="custome-radio">
                                    <input class="form-check-input" required="" type="radio" name="payment_option" id="exampleRadios4" checked="">
                                    <label class="form-check-label" for="exampleRadios4" data-bs-toggle="collapse" data-target="#checkPayment" aria-controls="checkPayment">Cash On Delivery</label>
                                    <div class="form-group collapse in" id="checkPayment">
                                        <p class="text-muted mt-5">Please send your cheque to Store Name, Store Street, Store Town, Store State / County, Store Postcode. </p>
                                    </div>
                                </div>
                                <div class="custome-radio">
                                    <input class="form-check-input" required type="radio" name="payment_option" id="exampleRadios6" value="wallet">
                                    <label class="form-check-label" for="exampleRadios6">Wallet</label>
                                
                                   
                                </div>
                                
                               
                               
                                <!-- <div class="custome-radio">
                                    <input class="form-check-input" required="" type="radio" name="payment_option" id="exampleRadios5" checked="">
                                    <label class="form-check-label" for="exampleRadios5" data-bs-toggle="collapse" data-target="#paypal" aria-controls="paypal">Paypal</label>
                                    <div class="form-group collapse in" id="paypal">
                                        <p class="text-muted mt-5">Pay via PayPal; you can pay with your credit card if you don't have a PayPal account.</p>
                                    </div>
                                </div> -->
                            </div>
                        </div>
                        <a href="#" id="placeOrderBtn" class="btn btn-fill-out btn-block mt-30">Place Order</a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    </section>
</main>

<script src="https://cdn.jsdelivr.net/npm/sweetalert2@10"></script>
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>

<link href="https://stackpath.bootstrapcdn.com/bootstrap/5.1.3/css/bootstrap.min.css" rel="stylesheet">
<script src="https://stackpath.bootstrapcdn.com/bootstrap/5.1.3/js/bootstrap.bundle.min.js"></script>


<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

<!-- cpnnn -->
<!-- <script>
    let couponApplied = false;
    let couponIdApplied = null;
    
    document.addEventListener('DOMContentLoaded', function () {
        // Event listener for the Apply Coupon button to show the modal
        document.getElementById('applyCouponBtn').addEventListener('click', function () {
            var myModal = new bootstrap.Modal(document.getElementById('applyCouponModal'), {
                keyboard: false
            });
            myModal.show();
        });
    
        // Event listener for the Apply Coupon button inside the modal
        document.getElementById('applyCouponBtnModal').addEventListener('click', function () {
            const couponId = document.querySelector('input[name="coupon"]:checked').value;
            const subTotal = document.getElementById('subtotal').textContent;
            console.log(subTotal);
    
            if (couponId) {
                console.log(subTotal);
                console.log(couponId);
    
                // Fetch operation to the backend
                fetch(`/applyCoupon?couponId=${couponId}&subTotal=${subTotal}`, {
                    method: 'POST',
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        Swal.fire({
                            icon: "success",
                            title: data.message,
                            text: "Coupon Applied",
                            confirmButtonText: "OK"
                        });
                        // Handle success (e.g., update the total amount on the page)
    
                        // Update the total amount based on the response
                        const discountRow = document.createElement('tr');
                        discountRow.innerHTML = `
                            <th id="discountHead">Discount</th>
                            <td colspan="2" class="product-subtotal" id="discountRow">- ₹<span>${data.discountAmount}</span></td>
                        `;
                        document.querySelector('#cart-items').appendChild(discountRow);
    
                        document.getElementById('total').textContent = data.differenceAmount;
    
                        couponApplied = true;
                        couponIdApplied = couponId;
                        document.getElementById('applyCouponBtn').disabled = true;
                        document.getElementById('removeCouponBtn').disabled = false;
                    } else if (!data.success) {
                        // Handle failure (e.g., show an error message)
                        Swal.fire({
                            icon: 'warning',
                            title: 'Failed to add coupon',
                            text: data.message
                        });
                    }
                    // Close the modal
                    var myModalEl = document.getElementById('applyCouponModal');
                    var modal = bootstrap.Modal.getInstance(myModalEl);
                    modal.hide();
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('An error occurred while applying the coupon.');
                });
            } else {
                alert('Please select a coupon.');
            }
        });
    
        // Event listener for the Remove Coupon button
        document.getElementById('removeCouponBtn').addEventListener('click', function () {
            if (couponApplied) {
                // Remove the discount row
                const discountRow = document.getElementById('discountRow');
                const discountHead = document.getElementById('discountHead');
                if (discountRow) {
                    discountRow.remove();
                    discountHead.remove();
                }
    
                // Recalculate the total amount without the coupon discount
                const subTotal = parseFloat(document.getElementById('subtotal').textContent);
                document.getElementById('total').textContent = subTotal.toFixed(2);
    
                couponApplied = false;
                couponIdApplied = null;
                document.getElementById('applyCouponBtn').disabled = false;
                document.getElementById('removeCouponBtn').disabled = true;
    
                Swal.fire({
                    icon: 'success',
                    title: 'Coupon Removed',
                    text: 'The coupon has been successfully removed.',
                    confirmButtonText: 'OK'
                });
            }
        });
    });

    

    </script> -->

<!-- nw cpnnn -->
<script>
    let couponApplied = false;
    let couponIdApplied = null;

    document.addEventListener('DOMContentLoaded', function () {
        // Event listener for the Apply Coupon button to show the modal
        document.getElementById('applyCouponBtn').addEventListener('click', function () {
            var myModal = new bootstrap.Modal(document.getElementById('applyCouponModal'), {
                keyboard: false
            });
            myModal.show();
        });

        // Event listener for the Apply Coupon button inside the modal
        document.getElementById('applyCouponBtnModal').addEventListener('click', function () {
            const couponId = document.querySelector('input[name="coupon"]:checked')?.value;
            const subTotal = document.getElementById('subtotal').textContent;

            if (couponId) {
                // Fetch operation to the backend
                fetch(`/applyCoupon?couponId=${couponId}&subTotal=${subTotal}`, {
                    method: 'POST',
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        Swal.fire({
                            icon: "success",
                            title: data.message,
                            text: "Coupon Applied",
                            confirmButtonText: "OK"
                        });

                        // Update the total amount based on the response
                        const discountRow = document.createElement('tr');
                        discountRow.innerHTML = `
                            <th id="discountHead">Discount</th>
                            <td colspan="2" class="product-subtotal" id="discountRow">- $<span>${data.discountAmount}</span></td>
                        `;
                        document.querySelector('#cart-items').appendChild(discountRow);

                        document.getElementById('total').textContent = data.differenceAmount;

                        couponApplied = true;
                        couponIdApplied = couponId;
                        document.getElementById('applyCouponBtn').disabled = true;
                        document.getElementById('removeCouponBtn').disabled = false;
                    } else {
                        Swal.fire({
                            icon: 'warning',
                            title: 'Failed to add coupon',
                            text: data.message
                        });
                    }

                    // Close the modal
                    var myModalEl = document.getElementById('applyCouponModal');
                    var modal = bootstrap.Modal.getInstance(myModalEl);
                    modal.hide();
                })
                .catch(error => {
                    console.error('Error:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'An error occurred while applying the coupon.'
                    });
                });
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'No Coupon Selected',
                    text: 'Please select a coupon.'
                });
            }
        });

        // Event listener for the Remove Coupon button
        document.getElementById('removeCouponBtn').addEventListener('click', function () {
            if (couponApplied) {
                // Remove the discount row
                const discountRow = document.getElementById('discountRow');
                const discountHead = document.getElementById('discountHead');
                if (discountRow) {
                    discountRow.remove();
                    discountHead.remove();
                }

                // Recalculate the total amount without the coupon discount
                const subTotal = parseFloat(document.getElementById('subtotal').textContent);
                document.getElementById('total').textContent = subTotal.toFixed(2);

                couponApplied = false;
                couponIdApplied = null;
                document.getElementById('applyCouponBtn').disabled = false;
                document.getElementById('removeCouponBtn').disabled = true;

                Swal.fire({
                    icon: 'success',
                    title: 'Coupon Removed',
                    text: 'The coupon has been successfully removed.',
                    confirmButtonText: 'OK'
                });
            }
        });
    });
</script>



<!-- wrking code -->

<!-- <script>

document.addEventListener('DOMContentLoaded', function() {
    var myModal = new bootstrap.Modal(document.getElementById('addAddressModal'));
    
    document.querySelector('[data-bs-toggle="modal"][data-bs-target="#addAddressModal"]').addEventListener('click', function() {
        myModal.show();
    });
    document.getElementById('closeModalBtn').addEventListener('click', function() {
        myModal.hide();
    });

});



    function validateAddress() {
        // Reset previous error messages
        document.querySelectorAll('.error-message').forEach(elem => elem.textContent = '');

        // Get input values
        const houseName = document.getElementById('houseName').value.trim();
        const street = document.getElementById('street').value.trim();
        const city = document.getElementById('city').value.trim();
        const state = document.getElementById('state').value.trim();
        const country = document.getElementById('country').value.trim();
        const postalCode = document.getElementById('postalCode').value.trim();
        const phoneNo = document.getElementById('phoneNo').value.trim();
        const addressType = document.querySelector('input[name="addressType"]:checked');

        let isValid = true;

        // Validation for empty fields
        if (houseName === '') {
            document.getElementById('houseNameError').textContent = 'House Name is required';
            isValid = false;
        }

        if (street === '') {
            document.getElementById('streetError').textContent = 'Street is required';
            isValid = false;
        }

        if (city === '') {
            document.getElementById('cityError').textContent = 'City is required';
            isValid = false;
        }
        if (state === '') {
            document.getElementById('stateError').textContent = 'State is required';
            isValid = false;
        }

        if (country === '') {
            document.getElementById('countryError').textContent = 'Country is required';
            isValid = false;
        }

        // Validation for postal code (should be exactly 6 digits)
        if (!/^\d{6}$/.test(postalCode)) {
            document.getElementById('postalCodeError').textContent = 'Postal Code should contain 6 digits';
            isValid = false;
        }

        // Validation for phone number (should be exactly 10 digits)
        if (!/^\d{10}$/.test(phoneNo)) {
            document.getElementById('phoneNoError').textContent = 'Phone No should contain 10 digits';
            isValid = false;
        }

        // Validation for address type
        if (!addressType) {
            document.getElementById('addressTypeError').textContent = 'Please select Address Type';
            isValid = false;
        }
        if (isValid) {
            // Data to be sent in the request body
            const data = {
                houseName: houseName,
                street: street,
                city: city,
                state: state,
                country: country,
                postalCode: postalCode,
                phoneNo: phoneNo,
                addressType: addressType.value
            };

            // Perform fetch operation
            fetch('/addAddress', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); // Parse response body as JSON
            })
            .then(data => {
                if (data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Address Added Successfully',
                        showConfirmButton: false,
                        timer: 1500
                    }).then(() => {
                        // Hide the modal after the SweetAlert
                        $('#addAddressModal').modal('hide');
                        
                        
                        document.getElementById('addAddressForm').reset();
                        location.reload();
                    });
                } else {
                    // Handle other response errors here
                    // For example, if there's an error message in the response
                    Swal.fire({
                        icon: 'error',
                        title: 'Adding Address Failed',
                        text: data.message || 'Unknown error occurred'
                    }).then(() => {
                    var myModalEl = document.getElementById('addAddressModal');
                    var modal = bootstrap.Modal.getInstance(myModalEl);
                    modal.hide();
                        // Hide the modal after the SweetAlert
                        $('#addAddressModal').modal('hide');
                        document.getElementById('addAddressForm').reset();
                        location.reload();
                    });
                }
            })
            .catch(error => {
                // Handle error
                console.error('There was a problem with the fetch operation:', error);
                // Optionally, show an alert for failure
                Swal.fire({
                    icon: 'error',
                    title: 'Address Addition Failed',
                    text: error.message
                });
            });
        }
    }




    document.addEventListener('DOMContentLoaded', function () {
        // Event listener for the Place Order button
        document.getElementById('placeOrderBtn').addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default action of anchor tag
            placeOrder();
        });
    });

    function placeOrder() {
        const selectedAddressIndex = document.querySelector('input[name="selectedAddress"]:checked');

        if (!selectedAddressIndex) {
            Swal.fire({
                icon: 'warning',
                title: 'Order Placement Failed',
                text: "Select an appropriate address for shipment",
            });
            return;
        }

        const selectedPaymentMethod = "Cash On Delivery";
        const totalAmount = document.getElementById("total").innerText;

        fetch('/placeOrder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                addressIndex: selectedAddressIndex.value,
                paymentMethod: selectedPaymentMethod,
                totalAmount: totalAmount
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                Swal.fire({
                    icon: "success",
                    title: data.message,
                    text: "View My Orders",
                    confirmButtonText: "OK"
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = "/userAccount";
                    }
                });
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Order Placement Failed',
                    text: data.message
                });
            }
        })
        .catch(error => {
            console.error('Error placing order:', error);
            Swal.fire({
                icon: 'error',
                title: 'Order Placement Failed',
                text: 'There was an error placing your order. Please try again.'
            });
        });
    }



</script> -->

<script>
    document.addEventListener('DOMContentLoaded', function() {
    var myModal = new bootstrap.Modal(document.getElementById('addAddressModal'));

    document.querySelector('[data-bs-toggle="modal"][data-bs-target="#addAddressModal"]').addEventListener('click', function() {
        myModal.show();
    });
    document.getElementById('closeModalBtn').addEventListener('click', function() {
        myModal.hide();
    });

    // Event listener for the Place Order button
    document.getElementById('placeOrderBtn').addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default action of anchor tag
        placeOrder();
    });
});

function validateAddress() {
    // Reset previous error messages
    document.querySelectorAll('.error-message').forEach(elem => elem.textContent = '');

    // Get input values
    const houseName = document.getElementById('houseName').value.trim();
    const street = document.getElementById('street').value.trim();
    const city = document.getElementById('city').value.trim();
    const state = document.getElementById('state').value.trim();
    const country = document.getElementById('country').value.trim();
    const postalCode = document.getElementById('postalCode').value.trim();
    const phoneNo = document.getElementById('phoneNo').value.trim();
    const addressType = document.querySelector('input[name="addressType"]:checked');

    let isValid = true;

    // Validation for empty fields
    if (houseName === '') {
        document.getElementById('houseNameError').textContent = 'House Name is required';
        isValid = false;
    }

    if (street === '') {
        document.getElementById('streetError').textContent = 'Street is required';
        isValid = false;
    }

    if (city === '') {
        document.getElementById('cityError').textContent = 'City is required';
        isValid = false;
    }
    if (state === '') {
        document.getElementById('stateError').textContent = 'State is required';
        isValid = false;
    }

    if (country === '') {
        document.getElementById('countryError').textContent = 'Country is required';
        isValid = false;
    }

    // Validation for postal code (should be exactly 6 digits)
    if (!/^\d{6}$/.test(postalCode)) {
        document.getElementById('postalCodeError').textContent = 'Postal Code should contain 6 digits';
        isValid = false;
    }

    // Validation for phone number (should be exactly 10 digits)
    if (!/^\d{10}$/.test(phoneNo)) {
        document.getElementById('phoneNoError').textContent = 'Phone No should contain 10 digits';
        isValid = false;
    }

    // Validation for address type
    if (!addressType) {
        document.getElementById('addressTypeError').textContent = 'Please select Address Type';
        isValid = false;
    }

    if (isValid) {
        // Data to be sent in the request body
        const data = {
            houseName: houseName,
            street: street,
            city: city,
            state: state,
            country: country,
            postalCode: postalCode,
            phoneNo: phoneNo,
            addressType: addressType.value
        };

        // Perform fetch operation
        fetch('/addAddress', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Parse response body as JSON
        })
        .then(data => {
            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Address Added Successfully',
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    // Hide the modal after the SweetAlert
                    $('#addAddressModal').modal('hide');
                    document.getElementById('addAddressForm').reset();
                    location.reload();
                });
            } else {
                // Handle other response errors here
                // For example, if there's an error message in the response
                Swal.fire({
                    icon: 'error',
                    title: 'Adding Address Failed',
                    text: data.message || 'Unknown error occurred'
                }).then(() => {
                    var myModalEl = document.getElementById('addAddressModal');
                    var modal = bootstrap.Modal.getInstance(myModalEl);
                    modal.hide();
                    document.getElementById('addAddressForm').reset();
                    location.reload();
                });
            }
        })
        .catch(error => {
            // Handle error
            console.error('There was a problem with the fetch operation:', error);
            Swal.fire({
                icon: 'error',
                title: 'Address Addition Failed',
                text: error.message
            });
        });
    }
}

function placeOrder() {
    const selectedAddressIndex = document.querySelector('input[name="selectedAddress"]:checked');

    if (!selectedAddressIndex) {
        Swal.fire({
            icon: 'warning',
            title: 'Order Placement Failed',
            text: "Select an appropriate address for shipment",
        });
        return;
    }

    const selectedPaymentMethod = document.querySelector('input[name="payment_option"]:checked').value;
    const totalAmount = document.getElementById("total").innerText;
    const subtotal = parseFloat(document.getElementById("subtotal").innerText);
    let couponId = null; // Assuming you have a way to get the applied couponId
    if (couponApplied) {
        couponId = couponIdApplied;
    }

    const orderData = {
        addressIndex: selectedAddressIndex.value,
        paymentMethod: selectedPaymentMethod,
        totalAmount: totalAmount,
        couponId: couponId,
        subtotal: subtotal
    };

    if (selectedPaymentMethod === "Cash On Delivery") {
        processOrder(orderData);
    } else if (selectedPaymentMethod === "razorpay") {
        processRazorpayOrder(orderData);
    } else if (selectedPaymentMethod === "wallet") {
        confirmWalletBalance(orderData);
    }
}

function processOrder(orderData) {
    fetch('/placeOrder', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Swal.fire({
                icon: "success",
                title: data.message,
                text: "View My Orders",
                confirmButtonText: "OK"
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = "/userAccount";
                }
            });
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Order Placement Failed',
                text: data.message
            });
        }
    })
    .catch(error => {
        console.error('Error placing order:', error);
        Swal.fire({
            icon: 'error',
            title: 'Order Placement Failed',
            text: 'There was an error placing your order. Please try again.'
        });
    });
}

// function processRazorpayOrder(orderData) {

//     fetch('/placeOrder', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(orderData)
//     })
//     .then(response => response.json())
//     .then(data => {
//         if (data.success) {
//             const options = {
//                 key: data.key_id,
//                 amount: data.amount,
//                 currency: "USD",
//                 name: "Books Kart",
//                 description: data.description,
//                 image: "user_assets/myimgs/bookHivelogo.png",
//                 order_id: data.order.id,
//                 handler: function (response) {
//                     OrderAfterPayment(orderData, "Success");
//                 },
//                 prefill: {
//                     contact: data.contact,
//                     name: data.name,
//                     email: data.email
//                 },
//                 notes: {
//                     description: data.description
//                 },
//                 theme: {
//                     color: "#00cc66"
//                 }
//             };

//             const razorpayObject = new Razorpay(options);
//             razorpayObject.open();

//             razorpayObject.on('payment.failed', function (response) {
//                 console.error(response.error);
//                 OrderAfterPayment(orderData, "Failed");
//             });
//         } else {
//             Swal.fire({
//                 icon: 'warning',
//                 title: 'Order Placement Failed',
//                 text: data.msg
//             });
//         }
//     })
//     .catch(error => {
//         console.error('Error placing order:', error);
//     });
// }

function processRazorpayOrder(orderData) {
    fetch('/placeOrder', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const options = {
                key: data.key_id, // Your Razorpay key ID
                amount: data.amount, // Amount in paise (1 INR = 100 paise)
                currency: "INR", // Adjust currency to INR for Indian Rupees
                name: "Books Kart",
                description: data.description || "Purchase from our store",
                image: "user_assets/myimgs/bookHivelogo.png",
                order_id: data.order_id, // Razorpay order ID
                handler: function (response) {
                    OrderAfterPayment(orderData, "Success");
                },
                prefill: {
                    contact: data.contact || "",
                    name: data.name || "",
                    email: data.email || ""
                },
                notes: {
                    description: data.description || ""
                },
                theme: {
                    color: "#00cc66"
                }
            };

            const razorpayObject = new Razorpay(options);
            razorpayObject.open();

            razorpayObject.on('payment.failed', function (response) {
                console.error('Payment failed:', response.error);
                OrderAfterPayment(orderData, "Failed");
            });
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Order Placement Failed',
                text: data.message || 'An error occurred while placing the order.'
            });
        }
    })
    .catch(error => {
        console.error('Error placing order:', error);
        Swal.fire({
            icon: 'error',
            title: 'Order Placement Failed',
            text: 'There was an error placing your order. Please try again.'
        });
    });
}

// function OrderAfterPayment(paymentResponse, status) {
//     fetch(`/onlineOrderPlacing`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             order_id: paymentResponse.order_id,
//             payment_id: paymentResponse.payment_id,
//             signature: paymentResponse.signature,
//             status: status
//         })
//     })
//     .then(response => response.json())
//     .then(data => {
//         if (data.success) {
//             Swal.fire({
//                 icon: "success",
//                 title: 'Order Confirmed',
//                 text: "Your payment was successful and the order has been placed.",
//                 confirmButtonText: "OK"
//             }).then((result) => {
//                 if (result.isConfirmed) {
//                     window.location.href = "/userAccount";
//                 }
//             });
//         } else {
//             Swal.fire({
//                 icon: 'error',
//                 title: 'Order Placement Failed',
//                 text: data.message
//             });
//         }
//     })
//     .catch(error => {
//         console.error('Error confirming order:', error);
//         Swal.fire({
//             icon: 'error',
//             title: 'Order Placement Failed',
//             text: 'There was an error confirming your order. Please try again.'
//         });
//     });
// }

function OrderAfterPayment(paymentResponse, status) {
    console.log('Payment Response:', paymentResponse);
    console.log('Status:', status);

    fetch(`/onlineOrderPlacing`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            order_id: paymentResponse.order_id,
            payment_id: paymentResponse.payment_id,
            signature: paymentResponse.signature,
            status: status
        })
    })
    .then(response => {
        console.log('Response status:', response.status);
        return response.json();
    })
    .then(data => {
        console.log('Response data:', data);
        if (data.success) {
            Swal.fire({
                icon: "success",
                title: 'Order Confirmed',
                text: "Your payment was successful and the order has been placed.",
                confirmButtonText: "OK"
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = "/userAccount";
                }
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Order Placement Failed',
                text: data.message
            });
        }
    })
    .catch(error => {
        console.error('Error confirming order:', error);
        Swal.fire({
            icon: 'error',
            title: 'Order Placement Failed',
            text: 'There was an error confirming your order. Please try again.'
        });
    });
}



function confirmWalletBalance(orderData) {
    fetch('/checkWalletBalance', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            if (data.walletBalance >= orderData.totalAmount) {
                processOrder(orderData);
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Insufficient Wallet Balance',
                    text: 'You do not have enough balance to complete this transaction.',
                });
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: data.message
            });
        }
    })
    .catch(error => {
        console.error('Error checking wallet balance:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'There was an error checking your wallet balance. Please try again.'
        });
    });
}




// function OrderAfterPayment(orderData, status) {
//     const { addressIndex, totalAmount, paymentMethod, couponId, subtotal, razorpay_payment_id, razorpay_signature } = orderData;

//     fetch(`/onlineOrderPlacing?addressIndex=${addressIndex}&status=${status}&totalAmount=${totalAmount}&paymentMethod=${paymentMethod}`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             couponId,
//             subtotal,
//             razorpay_payment_id,
//             razorpay_signature
//         })
//     })
//     .then(response => response.json())
//     .then(data => {
//         if (data.success) {
//             Swal.fire({
//                 icon: "success",
//                 title: 'Order Confirmed',
//                 text: "Your payment was successful and the order has been placed.",
//                 confirmButtonText: "OK"
//             }).then((result) => {
//                 if (result.isConfirmed) {
//                     window.location.href = "/account";
//                 }
//             });
//         } else {
//             Swal.fire({
//                 icon: 'warning',
//                 title: 'Order Placement Failed',
//                 text: data.message
//             });
//         }
//     })
//     .catch(error => {
//         console.error('Error confirming order:', error);
//         Swal.fire({
//             icon: 'error',
//             title: 'Order Placement Failed',
//             text: 'There was an error confirming your order. Please try again.'
//         });
//     });
// }


// function OrderAfterPayment(orderData, paymentStatus) {
//     fetch('/onlineOrderPlacing', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             orderData: orderData,
//             paymentStatus: paymentStatus
//         })
//     })
//     .then(response => response.json())
//     .then(data => {
//         if (data.success) {
//             Swal.fire({
//                 icon: "success",
//                 title: data.message,
//                 text: "View My Orders",
//                 confirmButtonText: "OK"
//             }).then((result) => {
//                 if (result.isConfirmed) {
//                     window.location.href = "/userAccount";
//                 }
//             });
//         } else {
//             Swal.fire({
//                 icon: 'warning',
//                 title: 'Order Placement Failed',
//                 text: data.message
//             });
//         }
//     })
//     .catch(error => {
//         console.error('Error processing payment response:', error);
//         Swal.fire({
//             icon: 'error',
//             title: 'Order Placement Failed',
//             text: 'There was an error processing your payment response. Please try again.'
//         });
//     });
// }

</script>







<!-- <script>
document.addEventListener("DOMContentLoaded", function() {
    calculateSubtotal();
    document.getElementById('placeOrderBtn').addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default action of anchor tag
        confirmQuantity();
    });
});

function calculateSubtotal() {
    const itemPrices = document.querySelectorAll('.item-price');
    let subtotal = 0;
    itemPrices.forEach(item => {
        subtotal += parseFloat(item.innerText);
    });
    document.getElementById('subtotal').innerText = subtotal.toFixed(2);
    document.getElementById('total').innerText = subtotal.toFixed(2);
}

function confirmQuantity() {
    const selectedAddressIndex = document.querySelector('input[name="selectedAddress"]:checked'); 
    if (!selectedAddressIndex) {
        Swal.fire({
            icon: 'warning',
            title: 'Order Placement Failed',
            text: "Select an appropriate address for shipment",
        });
        return;
    }

    fetch('/confirmQuantity', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const selectedAddressIndexValue = selectedAddressIndex.value;
            const selectedPaymentMethod = document.querySelector('input[name="payment_option"]:checked').value;
            const totalAmount = document.getElementById("total").innerText;
            const subtotal = document.getElementById("subtotal").innerText;
            let couponId = null;
            if (couponApplied) {
                couponId = couponIdApplied;
            }

            if (selectedPaymentMethod === "Cash On Delivery") {
                placeOrder(selectedAddressIndexValue, selectedPaymentMethod, totalAmount, couponId, subtotal);
            } else if (selectedPaymentMethod === "razorpay") {
                initiateRazorpayPayment(selectedAddressIndexValue, totalAmount, couponId, subtotal);
            } else if (selectedPaymentMethod === "wallet") {
                confirmWalletBalance(selectedAddressIndexValue, totalAmount, selectedPaymentMethod, couponId, subtotal);
            }
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Order Placement Failed',
                text: data.message,
            });
        }
    })
    .catch(error => {
        console.error('Error confirming quantity:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'There was a problem confirming the quantity.',
        });
    });
}

function placeOrder(addressIndex, paymentMethod, totalAmount, couponId, subtotal) {
    fetch('/placeOrder', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            addressIndex: addressIndex,
            paymentMethod: paymentMethod,
            totalAmount: totalAmount,
            couponId: couponId,
            subtotal: subtotal
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Swal.fire({
                icon: "success",
                title: data.message,
                text: "View My Orders",
                confirmButtonText: "OK"
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = "/account";
                }
            });
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Order Placement Failed',
                text: data.message
            });
        }
    })
    .catch(error => {
        console.error('Error placing order:', error);
        Swal.fire({
            icon: 'error',
            title: 'Order Placement Failed',
            text: 'There was a problem placing the order.',
        });
    });
}

function initiateRazorpayPayment(addressIndex, totalAmount, couponId, subtotal) {
    fetch("/placeOrder", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            addressIndex: addressIndex,
            paymentMethod: "razorpay",
            totalAmount: totalAmount,
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Proceed with Razorpay payment
            const options = {
                key: data.key_id,
                amount: data.amount,
                currency: "INR",
                name: "Book Hive",
                description: data.description,
                image: "user_assets/myimgs/bookHivelogo.png",
                order_id: data.order_id,
                handler: function (response) {
                    OrderAfterPayment(addressIndex, totalAmount, "razorpay", "Success", couponId, subtotal);
                },
                prefill: {
                    contact: data.contact,
                    name: data.name,
                    email: data.email
                },
                notes: {
                    description: data.description
                },
                theme: {
                    color: "#00cc66"
                }
            };

            const razorpayObject = new Razorpay(options);
            razorpayObject.open();

            razorpayObject.on('payment.failed', function (response) {
                console.error(response.error);
                OrderAfterPayment(addressIndex, totalAmount, "razorpay", "Failed", couponId, subtotal);
            });
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Order Placement Failed',
                text: data.msg
            });
        }
    })
    .catch(error => {
        console.error('Error initiating Razorpay payment:', error);
    });
}

function confirmWalletBalance(addressIndex, totalAmount, paymentMethod, couponId, subtotal) {
    fetch('/checkWalletBalance', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            if (data.walletBalance >= totalAmount) {
                placeOrder(addressIndex, paymentMethod, totalAmount, couponId, subtotal);
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Insufficient Wallet Balance',
                    text: 'You do not have enough balance to complete this transaction.',
                });
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'There was a problem checking wallet balance.',
            });
        }
    })
    .catch(error => {
        console.error('Error checking wallet balance:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'There was a problem checking wallet balance.',
        });
    });
}

function OrderAfterPayment(addressIndex, totalAmount, paymentMethod, status, couponId, subtotal) {
    fetch('/placeOrder', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            addressIndex: addressIndex,
            paymentMethod: paymentMethod,
            totalAmount: totalAmount,
            couponId: couponId,
            subtotal: subtotal,
            status: status
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Swal.fire({
                icon: "success",
                title: data.message,
                text: "View My Orders",
                confirmButtonText: "OK"
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = "/account";
                }
            });
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Order Placement Failed',
                text: data.message
            });
        }
    })
    .catch(error => {
        console.error('Error placing order:', error);
        Swal.fire({
            icon: 'error',
            title: 'Order Placement Failed',
            text: 'There was a problem placing the order.',
        });
    });
}
</script> -->







