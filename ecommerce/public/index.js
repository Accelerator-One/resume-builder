window.addEventListener('load', async () => {

    // Website state
    let products = null;
    let mp = new Map();
    let loggedIn = false;

    // UI reference
    const ref2 = document.getElementById('main-page');
    const ref1 = document.getElementById('login-page');

    // CART: sync management
    function mapResponseToCart(res) {
      
        if(res === undefined)
          return;

        res.forEach(data=> {
            mp[data.url] = data
        });

    }

    function parseToArray() {
     
      let result = [];

      for(key in mp) {
        result.push(mp[key]);
      }

      // console.log(result);
      return result;
    }

    // Initial UI rendering
    await fetch("/auth",{ method: "GET" })
    .then(res => {

        if(res.status === 401) {
            loggedIn = false;
            return undefined;
        }
        else {
            loggedIn = true;
            return res.json();
        }
    })
    .then(res => mapResponseToCart(res));
    

    if(loggedIn === true) {
       document.getElementById('main-page').classList.remove('hide');
       ref1.style.height = '0px';
    }
    else {
       document.getElementById('login-page').classList.remove('hide');
       ref2.style.height = '0px';
    }

    // Login Handler
    document.getElementById('login').addEventListener('click',async (evt) => {

        let email = document.getElementById('email').value;
        let passwd = document.getElementById('passwd').value;

        if(email.length === 0 || passwd.length === 0 ) {
            alert("Email/password not provided!");
            return;
        };

        // Auth login (returns cart if successful)
        await fetch("/login",{
            method: "POST",
            headers: {
                "Content-type": "application/json;charset=UTF-8"
            },
            body: JSON.stringify({email, passwd})
        })
        .then(res => {

            if(res.status === 401) {
                loggedIn = false;
                alert("User name/password is incorrect!");
                return undefined;
            }

            loggedIn = true;
            return res.json();
        })
        .then(res => mapResponseToCart(res))
        .catch(err=> console.log(err));

        if(loggedIn === false)
          return;

        const ref = document.getElementById('login-page');
        ref.classList.add('hide');
        ref.style.height = '0px';

        document.getElementById('main-page').classList.remove('hide');

    });

    // Logout Handler
    document.getElementById('logout').addEventListener('click', async () => {

        // Auth logout
        await fetch("/logout",{ method: "GET" })
        .then(res => {
            if(res.status === 401) {
                alert("Logout Unsuccessful! Please try again");
                throw Error("Server Declined!");
            }
            loggedIn = false;
        })
        .catch(err=> console.log(err));

        if(loggedIn === true)
          return;
    
        window.location.reload();

    });

    document.getElementById('cart').classList.add('hide');

    // Add product
    let addProduct = (name, price, url, description) => {

        let el = document.createElement("div");
        el.classList.add('card');
        el.classList.add('mb-4');
        el.classList.add('col-sm-4');

        el.innerHTML = `<img class="product" src="${url}" alt="a1.jpeg"/>
                        <div class="card-body">
                            <h5 class="card-title">${name}</h5>
                            <p class="card-text">$${price}</p>
                            <p class="card-text" style="display: none; visibility: hidden;" ><small class="text-muted">${description}</small></p>
                        </div>
                        <div class="row mb-4 px-2">
                            <div class="col-sm-3">
                                <button class="btn btn-danger sub" type="button"> - </button>
                            </div>
                            <div class="col-sm-6">
                                <input type="number" class='form-control-sm' value='1' style="text-align: center; width: 90px !important;" />
                            </div>
                            <div class="col-sm-2">
                                <button class="btn btn-success add" type="button"> + </button>
                            </div>   
                        </div>
                        <button type="button" class="btn btn-danger mb-2 add-to-cart" >
                            Add to Cart
                        </button>
                        <button type="button" class="btn btn-primary modal-viewer mb-2" data-bs-toggle="modal" data-bs-target="#modal">
                            View
                        </button>`;

        document.getElementById('content').appendChild(el);        

    };

    // Fetch products from inventory
    await fetch("/fetch",{ method : "GET" })
        .then(res => res.json())
        .then(res => {
          products = res;  
        })
        .catch(err => console.err(err));

    await products.forEach(data => {
        addProduct(data.name, data.price, data.url, data.description);
        if(mp[data.url] === undefined)
           mp[data.url] = data;
    });

    // Modal configuration
    const elRef = document.querySelectorAll('.modal-viewer');
    elRef.forEach(data => {

        data.addEventListener('click',(evt)=>{
        
            const ref = evt.target.parentNode.children[1];

            let title = ref.children[0].innerHTML;
            let price = ref.children[1].innerHTML;
            let description = ref.children[2].children[0].innerText;
            let url = evt.target.parentNode.children[0].src;

            // console.log(title, price, description, url);
    
            document.getElementById('modal-name').innerText = title;
            document.getElementById('modal-price').innerText = price;
            document.getElementById('modal-description').innerText = description;
            document.getElementById('modal-url').src = url;
            
        });
    });

    // Add item count
    const addRef = document.querySelectorAll('.add');
    addRef.forEach(data => {
        data.addEventListener('click', (evt)=> {

            const countRef = evt.target.parentNode
                             .previousElementSibling.children[0];
            
            countRef.value = parseInt(countRef.value) + 1;
        });
    });

    // Subtract item count
    const subRef = document.querySelectorAll('.sub');
    subRef.forEach(data => {
        data.addEventListener('click', (evt)=> {

            const countRef = evt.target.parentNode
                             .nextElementSibling.children[0];
            
            if(countRef.value <= 1)
                return;

            countRef.value = parseInt(countRef.value) - 1;
        });
    });

    // Cart configuration
    const cartRef = document.querySelectorAll('.add-to-cart');
    cartRef.forEach(data => {
        data.addEventListener('click', (evt)=> {
            
            let url = evt.target.parentNode.children[0].src;
            url = '/'+url.split('/').slice(3).join('/');
            // console.log(url,mp[url]);

            const count = evt.target.parentNode
                           .children[2].children[1]
                           .children[0];

            // console.log(count);

            
            if(mp[url]?.quantity === undefined)
                mp[url].quantity = 0;

            mp[url].quantity += parseInt(count.value);
            count.value = 1;

            // console.log(mp[url]);
        });
    });

    // Cart renderer
    function renderCart() {

        const parentRef = document.getElementById('cart');
        parentRef.innerHTML = "";

        for(key in mp) {

            const {name, url, quantity, price, description} = mp[key];
            if(quantity === undefined || parseInt(quantity) === 0)
              continue;

            let node = document.createElement("div");
            node.id = key;

            node.classList.add('card');
            node.classList.add('mb-4');
            node.classList.add('col-sm-4');

            node.innerHTML =   `<img class="product" src="${url}" alt="a1.jpeg"/>
                                <div class="card-body">
                                    <h5 class="card-title">${name}</h5>
                                    <p class="card-text">$${price}</p>
                                    <p class="card-text" style="display: none; visibility: hidden;" ><small class="text-muted">${description}</small></p>
                                </div>
                                <div class="row mb-4 px-2">
                                    <div class="col-sm-3">
                                        <button class="btn btn-danger subCart" type="button"> - </button>
                                    </div>
                                    <div class="col-sm-6">
                                        <input type="number" disabled class='form-control-sm' value=${quantity} style="text-align: center; width: 90px !important;" />
                                    </div>
                                    <div class="col-sm-2">
                                        <button class="btn btn-success addCart" type="button"> + </button>
                                    </div>   
                                </div>
                                <button type="button" class="btn btn-danger mb-2 remove">
                                    Delete
                                </button>`;
            
            parentRef.appendChild(node);
        }

        // Cart add item logic
        const addCartRef = document.querySelectorAll('.addCart');
        addCartRef.forEach(data => {

            data.addEventListener('click', (evt)=> {

                const countRef = evt.target.parentNode
                                    .previousElementSibling.children[0];

                countRef.value = parseInt(countRef.value) + 1;
                mp[evt.target.parentNode.parentNode.parentNode.id]["quantity"] = countRef.value;

            });
        });

        // Cart subtract item logic
        const subCartRef = document.querySelectorAll('.subCart');
        subCartRef.forEach(data => {

            data.addEventListener('click', (evt)=> {

                const countRef = evt.target.parentNode
                                    .nextElementSibling.children[0];

                if(countRef.value <= 1)
                    return;

                countRef.value = parseInt(countRef.value) - 1;
                mp[evt.target.parentNode.parentNode.parentNode.id]["quantity"] = countRef.value;

            });
        });

        // Cart remove item logic
        const delRef = document.querySelectorAll('.remove');
        delRef.forEach(data => {

            data.addEventListener('click', (evt)=> {

                let id = evt.target.parentNode.id;
                mp[id]["quantity"] = 0;

                renderCart();
            });
        });

    }

    // swap controller
    document.getElementById('swap').addEventListener("click", (evt)=> {

        const panel = document.getElementById('content');
        const cart = document.getElementById('cart');

        if(panel.classList.contains('hide')) {
            panel.classList.remove('hide');
            cart.classList.add('hide');
        } else {
            cart.classList.remove('hide');
            panel.classList.add('hide');
            renderCart();
        }

    });

    // sync controller
    setInterval(async () => {

      if(loggedIn) {

        await fetch('/sync', {
            method: 'POST',
            headers: {
                "Content-type": "application/json;charset=UTF-8"
            },
            body: JSON.stringify({userCart: parseToArray()})
        })
        .then(res => {
            if(res.status === 401) {
                throw Error('Sync error!');
            }
        })
        .catch(err => err);

      }

    }, 500);

});
