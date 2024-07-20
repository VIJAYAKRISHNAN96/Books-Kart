
<!-- <script>
document.getElementById('add-to-cart-btn').addEventListener('click', function() {
const productId = this.getAttribute('data-product-id');

fetch('/addToCart', {
method: 'POST',
headers: {
    'Content-Type': 'application/json'
},
body: JSON.stringify({ productId })
})
.then(response => response.json())
.then(data => {
if (data.success) {
    Swal.fire({
        title: 'Success!',
        text: 'Product added to cart successfully!',
        icon: 'success',
        confirmButtonText: 'OK'
    });
} else {
    Swal.fire({
        title: 'Error!',
        text: data.message || 'Failed to add product to cart. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
    });
}
})
.catch(error => {
console.error('Error:', error);
Swal.fire({
    title: 'Error!',
    text: 'An error occurred. Please try again.',
    icon: 'error',
    confirmButtonText: 'OK'
});
});
});

</script> -->

<!-- <script>
document.getElementById('add-to-cart-btn').addEventListener('click', function() {
    const productId = this.getAttribute('data-product-id');
    const userId = this.getAttribute('data-user-id'); // Get user ID

    fetch('/addToCart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId, userId }) // Include user ID in the request body
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Swal.fire({
                title: 'Success!',
                text: 'Product added to cart successfully!',
                icon: 'success',
                confirmButtonText: 'OK'
            });
        } else {
            Swal.fire({
                title: 'Error!',
                text: data.message || 'Failed to add product to cart. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire({
            title: 'Error!',
            text: 'An error occurred. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    });
});
</script>
-->

<!-- <script>
document.getElementById('add-to-cart-btn').addEventListener('click', function() {
const productId = this.getAttribute('data-product-id');
const userId = this.getAttribute('data-user-id');

if (!userId) {
Swal.fire({
    title: 'Not Logged In',
    text: 'Please log in to add items to the cart.',
    icon: 'warning',
    confirmButtonText: 'OK'
});
return;
}

fetch('/addToCart', {
method: 'POST',
headers: {
    'Content-Type': 'application/json'
},
body: JSON.stringify({ productId, userId })
})
.then(response => response.json())
.then(data => {
if (data.success) {
    Swal.fire({
        title: 'Success!',
        text: 'Product added to cart successfully!',
        icon: 'success',
        confirmButtonText: 'OK'
    });
} else {
    Swal.fire({
        title: 'Error!',
        text: data.message || 'Failed to add product to cart. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
    });
}
})
.catch(error => {
console.error('Error:', error);
Swal.fire({
    title: 'Error!',
    text: 'An error occurred. Please try again.',
    icon: 'error',
    confirmButtonText: 'OK'
});
});
});

</script> -->

<!-- last mod -->
<!-- <script>
document.getElementById('add-to-cart-btn').addEventListener('click', function() {
const productId = this.getAttribute('data-product-id');

fetch('/addToCart', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ productId })
})
.then(response => {
    return response.json().then(data => ({
        status: response.status,
        body: data
    }));
})
.then(({ status, body }) => {
    if (status === 200 && body.success) {
        Swal.fire({
            title: 'Success!',
            text: 'Product added to cart successfully!',
            icon: 'success',
            confirmButtonText: 'OK'
        });
    } else if (status === 401) {
        Swal.fire({
            title: 'Not Logged In',
            text: 'Please log in to add items to the cart.',
            icon: 'warning',
            confirmButtonText: 'OK'
        });
    } else {
        Swal.fire({
            title: 'Error!',
            text: body.message || 'Failed to add product to cart. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
})
.catch(error => {
    console.error('Fetch error:', error);
    Swal.fire({
        title: 'Error!',
        text: 'An error occurred. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
    });
});
});
</script> -->


<!-- <script>
document.getElementById('add-to-cart-btn').addEventListener('click', function() {
const productId = this.getAttribute('data-product-id');

fetch('/addToCart', {
method: 'POST',
headers: {
    'Content-Type': 'application/json'
},
body: JSON.stringify({ productId })
})
.then(response => response.json())
.then(data => {
if (data.success) {
    Swal.fire({
        title: 'Success!',
        text: 'Product added to cart successfully!',
        icon: 'success',
        confirmButtonText: 'OK'
    });
} else {
    Swal.fire({
        title: 'Error!',
        text: data.message || 'Failed to add product to cart. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
    });
}
})
.catch(error => {
console.error('Error:', error);
Swal.fire({
    title: 'Error!',
    text: 'An error occurred. Please try again.',
    icon: 'error',
    confirmButtonText: 'OK'
});
});
});

</script> -->
<!-- <script>
    document.getElementById('add-to-cart-btn').addEventListener('click', function() {
        const productId = this.getAttribute('data-product-id');

        // Check if the user is logged in
        const userId = '<%= user ? user.id : null %>'; // Assuming user ID is available in the template

        if (!userId) {
            Swal.fire({
                title: 'Not Logged In',
                text: 'Please log in to add items to the cart.',
                icon: 'warning',
                confirmButtonText: 'OK'
            });
            return;
        }

        // Fetch request to add product to cart
        fetch('/addToCart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productId })
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(err.message);
                });
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                Swal.fire({
                    title: 'Success!',
                    text: 'Product added to cart successfully!',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: data.message || 'Failed to add product to cart. Please try again.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                title: 'Error!',
                text: error.message || 'An error occurred. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        });
    });
</script> -->
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

<!-- <script>

document.getElementById('add-to-cart-btn').addEventListener('click', function() {
    const productId = this.getAttribute('data-product-id');
    const userId = this.getAttribute('data-user-id');

    if (!userId) {
        Swal.fire({
            title: 'Not Logged In',
            text: 'Please log in to add items to the cart.',
            icon: 'warning',
            confirmButtonText: 'OK'
        });
        return;
    }

    fetch('/addToCart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.message);
            });
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            Swal.fire({
                title: 'Success!',
                text: 'Product added to cart successfully!',
                icon: 'success',
                confirmButtonText: 'OK'
            });
        } else {
            Swal.fire({
                title: 'Error!',
                text: data.message || 'Failed to add product to cart. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire({
            title: 'Error!',
            text: error.message || 'An error occurred. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    });
});
</script>  -->

<!-- <script>

   document.getElementById('add-to-cart-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting the default way
    const productId = this.dataset.productId;

    fetch('/addToCart', {
method: 'POST',
headers: {
'Content-Type': 'application/json'
},
body: JSON.stringify({ productId: productId })
})
.then(response => {
if (response.ok) {
return response.json();
} else {
return response.json().then(data => {
throw new Error(data.error || 'An error occurred while adding the product to the cart.');
});
}
})
.then(data => {
Swal.fire({
title: 'Success!',
text: 'Product added to cart successfully!',
icon: 'success',
confirmButtonText: 'OK'
});
})
.catch(error => {
console.error('Error:', error);
Swal.fire({
title: 'Error',
text: error.message,
icon: 'error',
confirmButtonText: 'OK'
});
}); 

</script>


  <script>

  // Wait for the document to fully load before running the script
  document.addEventListener("DOMContentLoaded", function () {
    const mainImage = document.getElementById('main-product-image');
    const thumbnailImages = document.querySelectorAll('.thumbnail-image');

    // Add event listeners to each thumbnail image
    thumbnailImages.forEach(function(thumbnail) {
      thumbnail.addEventListener('mouseover', function() {
        const imageUrl = thumbnail.getAttribute('src');
        mainImage.setAttribute('src', imageUrl);
      });

      thumbnail.addEventListener('click', function() {
        const imageUrl = thumbnail.getAttribute('src');
        mainImage.setAttribute('src', imageUrl);
      });
    });
  });
</script> -->
<!-- new -->

<!-- //  <script>
//     document.addEventListener('DOMContentLoaded', function() {
//     const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

//     addToCartButtons.forEach(button => {
//         button.addEventListener('click', function(e) {
//             e.preventDefault();
//             const productId = this.getAttribute('data-product-id');
//             addToCart(productId);
//         });
//     });
// });

// function addToCart(productId) {
//     fetch('/addToCart', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//             productId: productId,
//             quantity: 1  // You can modify this if you want to allow variable quantities
//         })
//     })
//     .then(response => response.json())
//     .then(data => {
//         if (data.success) {
//             alert('Product added to cart successfully');
//             // Optionally update the cart UI here
//         } else if (data.alreadyInCart) {
//             alert('Product is already in the cart');
//         } else {
//             alert(data.error || 'An error occurred while adding the product to the cart');
//         }
//     })
//     .catch(error => {
//         console.error('Error:', error);
//         alert('An error occurred while adding the product to the cart');
//     });
// }
// </script> --> 





// <!-- <script>
    document.getElementById('add-to-cart-form').addEventListener('submit', function(event) {
event.preventDefault();
const productId = this.dataset.productId; // Get product ID from data attribute
const quantity = 1; // Default quantity

fetch('/addToCart', {
method: 'POST',
headers: {
'Content-Type': 'application/json'
},
body: JSON.stringify({ productId: productId, quantity: quantity }) // Send productId and quantity
})
.then(response => {
if (response.ok) {
return response.json();
} else {
return response.text().then(text => {
throw new Error(text || 'An error occurred while adding the product to the cart.');
});
}
})
.then(data => {
// Handle success
})
.catch(error => {
console.error('Error:', error);
});
});

</script> -->
// <!-- old -->
<!-- <script>
// Wait for the document to fully load before running the script
document.addEventListener("DOMContentLoaded", function () {
    const mainImage = document.getElementById('main-product-image');
    const thumbnailImages = document.querySelectorAll('.thumbnail-image');

    // Add event listeners to each thumbnail image
    thumbnailImages.forEach(function(thumbnail) {
        thumbnail.addEventListener('mouseover', function() {
            const imageUrl = thumbnail.getAttribute('src');
            mainImage.setAttribute('src', imageUrl);

    //   thumbnail.addEventListener('click', function() {
    // const imageUrl = thumbnail.getAttribute('src');
    // mainImage.setAttribute('src', imageUrl);


        });
    });
});




</script> -->
<!-- <script>
document.getElementById('add-to-cart-form').addEventListener('submit', function(event) {
event.preventDefault(); // Prevent the form from submitting the default way
const productId = this.dataset.productId;

fetch('/cart/add', {
method: 'POST',
headers: {
    'Content-Type': 'application/json'
},
body: JSON.stringify({ productId: productId })
})
.then(response => response.json())
.then(data => {
if (data.success) {
    Swal.fire({
        title: 'Success!',
        text: 'Product added to cart successfully!',
        icon: 'success',
        confirmButtonText: 'OK'
    });
} else {
    Swal.fire({
        title: 'Error!',
        text: 'Failed to add product to cart. Please try again.',
        icon: 'error',
        confirmButtonText: 'Close'
    });
}
})
.catch(error => {
console.error('Error:', error);
Swal.fire({
    title: 'Error!',
    text: 'An error occurred. Please try again.',
    icon: 'error',
    confirmButtonText: 'Close'
});
});
});


</script> 


<!-- <script>
document.getElementById('add-to-cart-btn').addEventListener('click', function() {
    const productId = this.dataset.productId; // Get the product ID from data attribute
    const userId = '<%= user ? user._id : "" %>'; // Ensure user ID is accessible

    if (!userId) {
        Swal.fire({
            title: 'Not Logged In',
            text: 'Please log in to add items to the cart.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Login',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = '/login'; // Adjust the login URL as needed
            }
        });
        return;
    }

    fetch('/cart/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId: productId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Swal.fire({
                title: 'Success!',
                text: 'Product added to cart successfully!',
                icon: 'success',
                confirmButtonText: 'OK'
            });
        } else {
            Swal.fire({
                title: 'Error!',
                text: data.message || 'Failed to add product to cart. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire({
            title: 'Error!',
            text: 'An error occurred. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    });
});
</script> -->

// <!-- <script> -->

 <!-- <script> 


const userId = '<%= user ? user._id : null %>'; // Ensure user ID is accessible

document.getElementById('add-to-cart-btn').addEventListener('click', function() {
const productId = this.dataset.productId; // Get the product ID from data attribute

if (!userId) {
    Swal.fire({
        title: 'Not Logged In',
        text: 'Please log in to add items to the cart.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Login',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = '/login'; // Adjust the login URL as needed
        }
    });
    return;
}

fetch('addToCart', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ productId: productId })
})
.then(response => response.json())
.then(data => {
    if (data.success) {
        Swal.fire({
            title: 'Success!',
            text: 'Product added to cart successfully!',
            icon: 'success',
            confirmButtonText: 'OK'
        });
    } else {
        Swal.fire({
            title: 'Error!',
            text: data.message || 'Failed to add product to cart. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
})
.catch(error => {
    console.error('Error:', error);
    Swal.fire({
        title: 'Error!',
        text: 'An error occurred. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
    });
});
});
</script>  -->
