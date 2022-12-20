//atalho para o document.querySelector
const query = (el)=> document.querySelector(el);
const queryA = (el)=> document.querySelectorAll(el);

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
    
    //trazer as informações da pizza que está sendo clicado
    pizzaItem.querySelector('.pizza-item a').addEventListener('click',(e)=>{
        e.preventDefault(); //desativar as ações default do a

        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        
        query('.pizzaBig img').src = pizzaJson[key].img;
        query('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        query('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;

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


