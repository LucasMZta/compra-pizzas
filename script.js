//atalho para o document.querySelector
const query = (el)=> document.querySelector(el);
const queryA = (el)=> document.querySelectorAll(el);


let modalQt = 1; //variavel para a qtde INICIAL de pizzas
let cart = []; //array do carrinho de compras
let modalKey = 0;

//listar todas as pizzas
pizzaJson.map((item, index) => {
    //gerando uma copia (clone) da div pizza-item
    let pizzaItem = query('.models .pizza-item').cloneNode(true);
    
    //criando uma key para identificar a pizza em especifico
    pizzaItem.setAttribute('data-key', index);

    //preencher as informações do pizza-item
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2).replace('.',',') }`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    
    //trazer as informações da pizza que está sendo clicado (QUANDO VOCE CLICAR NO + PARA ADD UMA PIZZA E ABRIR O MODAL)
    pizzaItem.querySelector('.pizza-item a').addEventListener('click',(e)=>{
        e.preventDefault(); //desativar as ações default do a
        
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQt = 1;
        modalKey = key;

        query('.pizzaBig img').src = pizzaJson[key].img;
        query('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        query('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        query('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2).replace('.',',') }`;
        //remover o selected caso ele esteja selecionado em um tamanho diferente do GRANDE
        query('.pizzaInfo--size.selected').classList.remove('selected');

        //um foreach com o selectorAll para percorrer os 3 diferentes tamanhos de pizzas
        queryA('.pizzaInfo--size').forEach((size, sizeIndex)=>{
            if(sizeIndex === 2) {
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex] ;
        });
        query('.pizzaInfo--qt').innerHTML = modalQt;

        query('.pizzaWindowArea').style.opacity = 0;
        query('.pizzaWindowArea').style.display = 'flex';
        setTimeout(()=>{
            //para fazer a transição quando abrir o modal da pizza
            query('.pizzaWindowArea').style.opacity = 1;
        }, 200);
    })
    
    //exibir as informações
    query('.pizza-area').append( pizzaItem );
});

//Eventos do MODAL
function closeModal() {
    query('.pizzaWindowArea').style.opacity = 0;
    setTimeout(()=> {
        //para fazer o efeito de fechar o modal
        query('.pizzaWindowArea').style.display = 'none';
    }, 500);
}

//quando ele clicar em fechar ou voltar
queryA('.pizzaInfo--cancelMobileButton, .pizzaInfo--cancelButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
});

//quando ele clicar em menos (-) na quantidade de pizzas
query('.pizzaInfo--qtmenos').addEventListener('click',()=>{
    if(modalQt > 1) {
        modalQt--;
        query('.pizzaInfo--qt').innerHTML = modalQt;
    }
});

//quando ele clicar em mais (+) na quantidade de pizzas
query('.pizzaInfo--qtmais').addEventListener('click',()=>{
    modalQt++;
    query('.pizzaInfo--qt').innerHTML = modalQt;
});

//um foreach com o selectorAll para percorrer os 3 diferentes tamanhos de pizzas para adc a class no tamanho clicado
queryA('.pizzaInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click',(e)=>{
        query('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});

//ação de adicionar a pizza ao clicar em "Adicionar ao Carrinho"
query('.pizzaInfo--addButton').addEventListener('click', ()=> {
    //reunir as informações de: qual a pizza, o tamanho selecionado e a quantidade de pizzas

    let size = parseInt(query('.pizzaInfo--size.selected').getAttribute('data-key'));
    //vai adc um OBJETO no array com o push
    cart.push({
        id: pizzaJson[modalKey].id,
        size: size,
        qt: modalQt
    })

    console.log(cart);
    
    closeModal();

});



