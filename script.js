//atalho para o document.querySelector
const query = (el) => document.querySelector(el);
const queryA = (el) => document.querySelectorAll(el);

query('.menu-faketrigger').addEventListener('click', (e) => {
    query('aside').classList.toggle('w-auto');
});

let modalQt = 1; //variavel para a qtde INICIAL de pizzas
let cart = []; //array do carrinho de compras
let modalKey = 0;
let types = [];
let filterType = 'all';

function generateCat() {
    for (let i in types) {
        let type = types[i];
        let span = document.createElement('span');
        span.setAttribute('data-type', type);
        span.innerHTML = type;
        query('.categories').appendChild(span);
    }

    queryA('.categories span').forEach((cat)=>{
        cat.addEventListener('click', (e)=>{
            filterType = e.target.getAttribute('data-type');
            query('.pizza-area').innerHTML = '';
            listItems();
        });
    });
}
//listar todos os itens
function listItems() {
    pizzaJson.map((item, index) => {
        //gerando uma copia (clone) da div pizza-item
        let pizzaItem = query('.models .pizza-item').cloneNode(true);

        let typeItem = item.type;

        if (typeItem == filterType || filterType === 'all') {
            console.log(filterType);

            //criando uma key para identificar a pizza em especifico
            pizzaItem.setAttribute('data-key', index);
            pizzaItem.setAttribute('data-type', typeItem);
            if (types.indexOf(typeItem) === -1) {
                types.push(typeItem);
            }

            //preencher as informações do pizza-item
            pizzaItem.querySelector('.pizza-item--img img').src = item.img;
            pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2).replace('.', ',')}`;
            pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
            pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

            //trazer as informações da pizza que está sendo clicado (QUANDO VOCE CLICAR NO + PARA ADD UMA PIZZA E ABRIR O MODAL)
            pizzaItem.querySelector('.pizza-item a').addEventListener('click', (e) => {
                e.preventDefault(); //desativar as ações default do a
                query('.pizzaInfo--sizes').innerHTML = '';

                let key = e.target.closest('.pizza-item').getAttribute('data-key');
                modalQt = 1;
                modalKey = key;

                query('.pizzaBig img').src = pizzaJson[key].img;
                query('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
                query('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
                query('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2).replace('.', ',')}`;
                //remover o selected caso ele esteja selecionado em um tamanho diferente do GRANDE
                // query('.pizzaInfo--size.selected').classList.remove('selected');

                //um foreach com o selectorAll para percorrer os 3 diferentes tamanhos de pizzas
                for(let i in pizzaJson[key].sizes) {
                    let size = pizzaJson[key].sizes[i];
                    let cat = pizzaJson[key].categories[i];
                    if(size){
                        let divSize = document.createElement('div');
                        divSize.setAttribute('data-key',i);
                        divSize.classList.add('pizzaInfo--size');
                        divSize.innerHTML = `${cat.toUpperCase()} `;
                        let spanSize = document.createElement('span');
                        spanSize.innerText = size;
                        divSize.appendChild(spanSize);
                        if(i == (pizzaJson[key].sizes.length - 1)) {
                            divSize.classList.add('selected');
                        }
                        query('.pizzaInfo--sizes').appendChild(divSize);
                    } 
                }
                query('.pizzaInfo--sizes span:last-child').classList.add('selected');
                query('.pizzaInfo--qt').innerHTML = modalQt;

                query('.pizzaWindowArea').style.opacity = 0;
                query('.pizzaWindowArea').style.display = 'flex';

                queryA('.pizzaInfo--size').forEach((size) => {
                    size.addEventListener('click', (e) => {
                        query('.pizzaInfo--size.selected').classList.remove('selected');
                        e.target.closest('.pizzaInfo--size').classList.add('selected');
                    });
                });
                setTimeout(() => {
                    //para fazer a transição quando abrir o modal da pizza
                    query('.pizzaWindowArea').style.opacity = 1;
                }, 200);
            })

            query('.pizza-area').append(pizzaItem);
        }
    });
}


//Eventos do MODAL
function closeModal() {
    query('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        //para fazer o efeito de fechar o modal
        query('.pizzaWindowArea').style.display = 'none';
    }, 500);
}

//quando ele clicar em fechar ou voltar
queryA('.pizzaInfo--cancelMobileButton, .pizzaInfo--cancelButton').forEach((item) => {
    item.addEventListener('click', closeModal);
});

//quando ele clicar em menos (-) na quantidade de pizzas
query('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if (modalQt > 1) {
        modalQt--;
        query('.pizzaInfo--qt').innerHTML = modalQt;
    }
});

//quando ele clicar em mais (+) na quantidade de pizzas
query('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQt++;
    query('.pizzaInfo--qt').innerHTML = modalQt;
});

// //um foreach com o selectorAll para percorrer os 3 diferentes tamanhos de pizzas para adc a class no tamanho clicado
// queryA('.pizzaInfo--size').forEach((size, sizeIndex) => {
//     console.log(size);
//     size.addEventListener('click', (e) => {
//         query('.pizzaInfo--size.selected').classList.remove('selected');
//         e.target.classList.add('selected');
//     });
// });

//ação de adicionar a pizza ao clicar em "Adicionar ao Carrinho"
query('.pizzaInfo--addButton').addEventListener('click', () => {
    //reunir as informações de: qual a pizza, o tamanho selecionado e a quantidade de pizzas
    let size = parseInt(query('.pizzaInfo--size.selected').getAttribute('data-key')); //tamanho da pizza
    let identifier = `${pizzaJson[modalKey].id}#${size}`; //identificador da pizza para o carrinho
    let key = cart.findIndex((item) => { //verificar se já existe este identificador no carrinho, ou seja, a pizza e o tamanho
        return item.identifier == identifier;
    });

    if (key > -1) { //se existir, modifica apenas a quantidade
        cart[key].qt += modalQt;
    } else { //se não, vai adc um OBJETO no array com o push
        cart.push({
            identifier: identifier,
            id: pizzaJson[modalKey].id,
            type: pizzaJson[modalKey].type,
            size: size,
            qt: modalQt
        });
    };
    updateCart();
    closeModal();
});

function updateCart() {
    //atualizando a versao MOBILE
    query('.menu-openner span').innerHTML = cart.length;

    if (cart.length > 0) {
        query('aside').classList.add('show');
        query('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for (let i in cart) {
            let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
            let cartItem = query('.models .cart--item').cloneNode(true);

            subtotal += pizzaItem.price * cart[i].qt;

            cartItem.querySelector('img').src = pizzaItem.img; //adc a imagem
            let pizzaItemSize = '';
            switch (cart[i].size) {
                case 0:
                    if (cart[i].type === 'bebidas') {
                        pizzaItemSize = '600ml';
                    } else {
                        pizzaItemSize = 'P';
                    }
                    break;
                case 1:
                    if (cart[i].type === 'bebidas') {
                        pizzaItemSize = '1,5L';
                    } else {
                        pizzaItemSize = 'M';
                    }
                    break;
                case 2:
                    if (cart[i].type === 'bebidas') {
                        pizzaItemSize = '2L';
                    } else {
                        pizzaItemSize = 'G';
                    }
                    break;
                default:
                    pizzaItemSize = 'null';
            }
            cartItem.querySelector('.cart--item-nome').innerHTML = `${pizzaItem.name} (${pizzaItemSize})`;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            query('.cart--details .subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;

            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if (cart[i].qt > 1) {
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1); //remove o item do carrinho
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qt++;
                updateCart();
            });

            query('.cart').append(cartItem); //adc o item do carrinho na tela. 
        }
        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        query('.cart--details .desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2).replace('.', ',')}`;
        query('.cart--details .total span:last-child').innerHTML = `R$ ${total.toFixed(2).replace('.', ',')}`;

    } else {
        query('aside').classList.remove('show')
        query('aside').style.left = '100vw';
    }
}
//exibir o carrinho na versao mobile
query('.menu-openner').addEventListener('click', () => {
    if (cart.length > 0) {
        query('aside.show').style.left = '0';
    }
});
//esconder o carrinho na versao mobile
query('.menu-closer').addEventListener('click', () => {
    query('aside').style.left = '100vw';
});
//filtrar os itens pela categoria


//function
listItems();
generateCat();




