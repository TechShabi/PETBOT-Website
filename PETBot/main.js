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
        }
    }
}
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
        }
    }   
}

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
        }
    }
}
// End Sort Func


//Quantity options Func
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

//Reset Quantity when modal is closed.
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
});


