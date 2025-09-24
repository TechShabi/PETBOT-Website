// Start Search Func
function filter() {
    var filterValue, input, ProductList, ProductName, h5, i;
    input = document.getElementById("search");
    filterValue = input.value.toUpperCase();
    ProductList = document.getElementById("product-list");
    ProductName = ProductList.getElementsByClassName("col-md-3");
    for(i=0; i<ProductName.length; i++) {
        h5 = ProductName[i].getElementsByTagName("h5")[0];
        // In Search if typed string matches with the element name.
        if(h5.innerHTML.toUpperCase().indexOf(filterValue) > -1) {
            ProductName[i].style.display = "";
        }
        else {
            ProductName[i].style.display = "none";
        };
    };
};
// End Search Func

// Start Sort Func
function lowList() {
    var ProductList, ProductName, i, switching, b, c, shouldSwitch;
    ProductList = document.getElementById("product-list");
    ProductName = ProductList.getElementsByClassName("col-md-3");
    switching = true;
    while(switching) {
        switching = false;
        //loop is running through each product
        for(i=0; i<(ProductName.length-1); i++) {
            shouldSwitch = false;
            b = ProductName[i].getElementsByTagName("span")[0].innerHTML;
            c = ProductName[i+1].getElementsByTagName("span")[0].innerHTML;

            //remove $ sign.
            b = b.replace("$", "")
            c = c.replace("$", "")

            //condition to check price for each product item.
            if (Number(b) > Number(c)) {
                shouldSwitch = true;
                break;
            }
        }
        // Each product element will switch with next product element based on product
        // price sorting
        if (shouldSwitch) {
            ProductName[i].parentNode.insertBefore(ProductName[i+1],ProductName[i]);
            switching = true;
        };
    };
};

function highList() {
    var ProductList, ProductName, i, switching, b, c, shouldSwitch;
    ProductList = document.getElementById("product-list");
    ProductName = ProductList.getElementsByClassName("col-md-3");
    switching = true;
    while(switching) {
        switching = false;
        for(i=0; i<(ProductName.length-1); i++) {
            shouldSwitch = false;
            b = ProductName[i].getElementsByTagName("span")[0].innerHTML;
            c = ProductName[i+1].getElementsByTagName("span")[0].innerHTML;

            //remove $ sign.
            b = b.replace("$","")
            c = c.replace("$","")

            //condition to check price for each product item.
            if(Number(b) < Number(c)) {
                shouldSwitch = true;
                break;
            }
        }

        // Each product element will switch with next product element based on product
        // price sorting

        if (shouldSwitch) {
            ProductName[i].parentNode.insertBefore(ProductName[i+1],ProductName[i]);
            switching = true;
        };
    };
};
// End Sort Func

//Start Quantity Options Func
const Btns = document.querySelectorAll(".qtyVal");

Btns.forEach(btn => {
    btn.addEventListener("click", function (e) {
        e.preventDefault();

        let selectedQty = this.textContent.trim();

        //har button apne modal ke andar jo qty span hai usko dhoondo.
        const modal = this.closest(".modal");
        const Val = modal.querySelector(".qty");
        
        //update only inside that modal.
        if(Val) {
            Val.textContent = selectedQty;
        }
    });
});

//Reset Quantity when modal is closed
document.addEventListener("click", function(e) {
    if(e.target.classList.contains("btn-close")) {
        
        //Modal kai andar dropdown button find karo
        let modal = e.target.closest(".modal");
        if(modal) {
            let btn = modal.querySelector(".qty");
            if(btn) {
                btn.textContent = "1";
            }
        }
    }
    if(e.target.classList.contains("add-btn")) {
        //Modal kai andar dropdown button find karo
        let modal = e.target.closest(".modal");
        if(modal) {
            let btn = modal.querySelector(".qty");
            if(btn) {
                btn.textContent = "1";
            }
        }
    }
});
//End Quantity Options Func


//Start Dynamic Modal
let selectedProduct = {};
let addedProducts = new Set(); //store id's of products already added

// Find Product Id
document.getElementById("modal").addEventListener('show.bs.modal', function(event) {
    let card = event.relatedTarget; //jis product sai modal khula
    let productId = card.dataset.id;

    document.querySelectorAll('.product').forEach(prod => {
        prod.addEventListener('click', () => {
            selectedProduct = { 
                id: productId,
                name: prod.dataset.name,
                price: prod.dataset.price,
                img: prod.dataset.img
            };
            
            document.getElementById('modalName').innerText = selectedProduct.name;
            document.getElementById('modalPrice').innerText = "Price: " + selectedProduct.price;
            document.getElementById('modalImg').src = selectedProduct.img;
            
            //Add Button Disabled
            const btn = document.querySelector(".add-btn");
            
            if(addedProducts.has(selectedProduct.id)) {
                btn.disabled = true;
                btn.innerText = "Added";
            } else {
                btn.disabled = false;
                btn.innerText = "Add To Cart";
            }
        });
    });
});   
//End Dynamic Modal

//Add To Cart
let cartMsg = document.querySelector(".cart-message");

document.addEventListener("click", function(e) {
    if(e.target.classList.contains("add-btn")) {
        
        let cart = JSON.parse(localStorage.getItem("cart")) || []; //pura cart localStorage sai uthao 
        
        if(!addedProducts.has(selectedProduct.id)) {
            cart.push(selectedProduct); //naya product add karo
            localStorage.setItem("cart", JSON.stringify(cart)); //wapis localStorage mai save karo
            
            addedProducts.add(selectedProduct.id); //product ko "added" mark kar diya
            cartMsg.classList.remove('hide');
            document.getElementById('cart-btn').style.display = "block";

            renderCart();
            
            setTimeout(() => {
                cartMsg.classList.add('hide');
            }, 2000);
        }
    }
});


function renderCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartItems = document.getElementById('cartItems');

    cartItems.innerHTML = "";

    if(cart.length === 0) {
        document.getElementById('cart-btn').style.display = "none";
    } else {
        document.getElementById('cart-btn').style.display = "block";
        cartItems.innerHTML = "";
        cart.forEach(item => {
            cartItems.innerHTML += `
            <div class="d-flex align-items-center mb-2">
                <img src="${item.img}" width="60" class="me-2">
                <div>
                    <small class="mb-0">${item.name}</small>
                    <h6>Rs. ${item.price}<h6>
                </div>
                <button class="btn btn-sm ms-auto" onclick="removeItem('${item.id}')">
                    <i class="fas fa-trash text-danger"></i>
                </button>
            </div>`
        });
    }
}


function removeItem(id) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    cart = cart.filter(item => String(item.id) !== String(id));

    localStorage.setItem("cart", JSON.stringify(cart));
    
    addedProducts.delete(String(id));

    
    renderCart();
    
    document.getElementById('cart-btn').style.display = "none";

    const btn = document.querySelector(`.add-btn[data-id="${String(id)}"]`);
    if(btn) {
        btn.disabled = false;
        btn.innerText = "Add To Cart";
    }
};

document.addEventListener("DOMContentLoaded", () => {
    renderCart(); //har page load pai cart auto show hooga
});

