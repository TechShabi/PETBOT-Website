// Start Search Func
function filter() {
    var filterValue, input, ProductList, ProductName, h5, i;
    input = document.getElementById("search");
    filterValue = input.value.toUpperCase();
    ProductList = document.getElementById("product-list");
    ProductName = ProductList.getElementsByClassName("product");
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
let Btns = document.querySelectorAll(".qtyVal");

Btns.forEach(btn => {
    btn.addEventListener("click", function (e) {
        e.preventDefault();

        let selectedQty = this.textContent.trim();

        //har button apne modal ke andar jo qty span hai usko dhoondo.
        let modal = this.closest(".modal");
        let Val = modal.querySelector(".qty");
        
        //update only inside that modal.
        if(Val) {
            Val.textContent = selectedQty;
            selectedProduct.qty = selectedQty;
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
                img: prod.dataset.img,
                qty: '1'
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
            checkQty();
            
            setTimeout(() => {
                cartMsg.classList.add('hide');
            }, 2000);
        }
    }
});

function checkQty() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    addedProducts.forEach(id => {
        let product = cart.find(item => item.id === id);

        if(product) {
            if(Number(product.qty == 1)) {
                document.querySelector(`#sub-btn-${id}`).classList.add("hide");
                document.querySelector(`#del-btn-${id}`).classList.remove("hide");
                
            } else if(Number(product.qty > 1)) {
                document.querySelector(`#sub-btn-${id}`).classList.remove("hide");
                document.querySelector(`#del-btn-${id}`).classList.add("hide");
            }
        }
    })
};

function renderCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartItems = document.getElementById('cartItems');
    let totalItems = 0;
    
    cartItems.innerHTML = "";
    
    if(cart.length === 0) {
        document.getElementById('cart-btn').style.display = "none";
        document.getElementById('cart-count').classList.add('hide');
        document.getElementById("cartBody").classList.remove('hide');
        document.getElementById("moreItems").classList.add('hide');
        document.getElementById("cart-amount").classList.add('hide');
        document.getElementById("checkout").classList.add('hide');
        
    } else {
        document.getElementById('cart-btn').style.display = "block";
        document.getElementById('cart-count').classList.remove('hide');
        document.getElementById("cartBody").classList.add('hide');
        document.getElementById("moreItems").classList.remove('hide');
        document.getElementById("cart-amount").classList.remove('hide');
        document.getElementById("checkout").classList.remove('hide');
        
        cartItems.innerHTML = "";
        cart.forEach(item => {
            cartItems.innerHTML += `
            <div class="d-flex align-items-center mb-2">
                <img src="${item.img}" width="80" height="80" class="object-fit-cover rounded me-2">
                <div>
                    <small class="mb-0" style="font-size: 20px;">${item.name}</small>
                    <h6>Rs. ${item.price}<h6>
                </div
                <div>
                    <button class="btn btn-sm d-flex align-items-center ms-auto py-1 px-3" style="cursor: default; border: 1px solid #ff523b; border-radius: 25px;">
                        <i class="fas fa-subtract pe-2" style="cursor: pointer; color: #ff523b;" id="sub-btn-${item.id}" onclick="subQty('${item.id}')"></i>
                        <i class="fas fa-trash text-danger pe-2" style="cursor: pointer" id="del-btn-${item.id}" onclick="removeItem('${item.id}')"></i>
                        <p class="mx-1 mb-0" style="cursor:text" id="qtyValue-${item.id}">${item.qty}</p>
                        <i class="fas fa-add ps-2" style="cursor: pointer; color: #ff523b" id="add-btn" onclick="addQty('${item.id}')"></i>
                    </button>
                </div>  
                </div>`
                
            updateCartTotal();
            totalItems ++;
            document.getElementById("count").innerHTML = totalItems;
        });
    };
};
  
function addQty(id) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let product = cart.find(item => item.id === id);

    if(product) {
        product.qty = Number(product.qty) + 1;
        document.querySelector(`#qtyValue-${id}`).innerText = product.qty;
        localStorage.setItem("cart", JSON.stringify(cart));
    }
    
    if(product.qty > 1) {
        document.querySelector(`#sub-btn-${id}`).classList.remove("hide");
        document.querySelector(`#del-btn-${id}`).classList.add("hide");
    } 
    updateCartTotal();
}

function subQty(id) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let product = cart.find(item => item.id === id); 
    
    if(product) {
        product.qty = Number(product.qty) - 1;
        document.querySelector(`#qtyValue-${id}`).innerText = product.qty;
        localStorage.setItem("cart", JSON.stringify(cart));
    }
    
    if(product.qty == 1) {
        document.querySelector(`#sub-btn-${id}`).classList.add("hide");
        document.querySelector(`#del-btn-${id}`).classList.remove("hide");
    } 
    updateCartTotal();
}

function updateCartTotal() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let delivery = document.getElementById("delivery").innerHTML.replace("$","");
    let total = 0;
    
    cart.forEach(item => {
        let price = Number(item.price.replace("$",""));
        total += price * item.qty;
        
    });
    let grandTotal = Number(total) + Number(delivery);
    
    document.getElementById("total").innerHTML = "$" + total.toFixed(2);
    document.getElementById("grand").innerHTML = "$" + grandTotal.toFixed(2);
    document.getElementById("check-grand").innerHTML = "$" + grandTotal.toFixed(2);
};


function removeItem(id) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(item => String(item.id) !== String(id));
    localStorage.setItem("cart", JSON.stringify(cart));
    
    updateCartTotal();
    addedProducts.delete(String(id));
    
    renderCart();
    checkQty();
    updateCartTotal();
    
    const btn = document.querySelector(`.add-btn[data-id="${String(id)}"]`);
    if(btn) {
        btn.disabled = false;
        btn.innerText = "Add To Cart";
    }
};


document.addEventListener("DOMContentLoaded", () => {
    renderCart(); //har page load pai cart auto show hooga
    updateCartTotal();
    restoreButtonStates(); //refresh kai baad button disable state restore ho jaye
    checkQty();
});

function restoreButtonStates() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart.forEach(item => {
        const btn = document.querySelector(`.add-btn[data-id="${item.id}]`);
        if(btn) {
            btn.disable = true;
            btn.innerText = "Added";
        }
        addedProducts.add(item.id);
    });
}

