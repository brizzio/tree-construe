/* For self invoking code
(function(fn){var d=document;(d.readyState=='loading')?d.addEventListener('DOMContentLoaded',fn):fn();})(function(){

    //Some Code here
    //DOM is avaliable
    //var h1s = document.querySelector("h1");

}); 

ou

function ready(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    document.attachEvent('onreadystatechange', function() {
      if (document.readyState != 'loading')
        fn();
    });
  }
}
example inline usage:

ready(function() { alert('hello'); });


*/

var url = 'https://script.google.com/macros/s/AKfycbwfI7x2dqg4kBeKvlsv8OY-arZ5w9fK5V8RSHBpLnK8hkVtVg0x/exec'

var database = {};

var totalProdutos = 0;
var totalSkus = 0;

window.onload = start_function;

function start_function(){
    // constroi o menu bar e a barra lateral do app
    console.log('carregando barra de menu da pagina...')
    // axios.get("../../pages/components/menu-bar.html").then(function(response){
    //     document.getElementById("menu-bar").innerHTML=response.data
    //     console.log('depois q carregou o menu ==> carrega a sidebar da pagina...')
    //     axios.get("../../pages/components/menu-sidebar.html").then(function(response){
    //         document.getElementById("menu-sidebar").innerHTML=response.data
    //     })
    
    // })
    
    //Carrega a arvore do cadastro e armazena na variavel database... 
    axios.get(url, {
        params: {
        f: "arvore"
        }
    })
    .then(function (response) {
        console.log(response.data);
        database = response.data
        somaSKU();
        document.getElementById("lista-categorias").innerHTML=collapse_categorias(database.categorias)
        
    })
    .catch(function (error) {
        console.log(error);
    })
    .then(function () {
        // always executed
        
    });  
  

}


function cardsHTML(){

    return cardHTML("panel-primary","CATEGORIAS",database.categoriasCount,"fa-database","#") + 
           cardHTML("panel-green","PRODUTOS",database.categoriasCount,"fa-flash","#") +
           cardHTML("panel-yellow","SKUS CATALOGADAS",database.categoriasCount,"fa-cubes","#") +
           cardHTML("panel-red","SKUS LIDAS",database.categoriasCount,"fa-eye","#") 

}

function collapse_categorias(cat){

        var liarray = cat.map(function(c){

            var produtos = 0
            var subcat = c.subcategorias.map(function(sc){
                totalProdutos+= sc.produtosCount
                produtos += sc.produtosCount
                
                return `<a href="#" onclick="showProdutos('`+ c.descricao + `','`+ sc.descricao + `');" class="collection-item"><span class="new badge grey" data-badge-caption="produtos CONSTRUE">` + sc.produtosCount + `</span>`+ sc.descricao + `</a>`
            })    


            return `
            <li>
                <div class="collapsible-header">
                    <i class="material-icons">apps</i>
                    `+ c.descricao + `
                    <span class="new badge orange" data-badge-caption="produtos CONSTRUE">`+ produtos + `</span>
                </div>
                <div class="collapsible-body"><div class="collection">`+ subcat.join() + `</div>
            </li>
           `
        })
    console.log(totalProdutos)    
    document.getElementById("total-geral").innerText = totalProdutos + " produtos"  
    return  liarray.join() 
}

/* function getProdutos(subcategoria) {
 
    database.categorias.forEach(function(c){
        c.subcategorias.forEach(function(s){
            if(s.descricao === subcategoria){
                console.log(s)
                return s.produtos;
            }
        })
    })
  
}  */

function montaCardsDeProdutos(produtos){
   
      return  produtos.map(function(p){
                    var tagContexto, tagQualificacao
                    tagContexto = JSON.stringify(p.tagCon)
                        if(Object.getOwnPropertyNames(p.tagCon).length === 0){
                            tagContexto = `<p>Não existem tags de contexto para esse produto...`
                        }
                        tagQualificacao = JSON.stringify(p.tagQual)
                        if(Object.getOwnPropertyNames(p.tagQual).length === 0){
                            tagQualificacao = `<p>Não existem tags de qualificação para esse produto...`
                        }
                        console.log(p)
                        console.log(tagContexto)
                        console.log(tagQualificacao)

                        return `
                        <div class="row">
                            <div class="col s12">
                                <div class="card blue-grey darken-1">
                                    <div class="card-content white-text">
                                        <span class="card-title">` + p.descricao + `</span>
                                        <p>`+ tagContexto + `</p>
                                        <p>`+ tagQualificacao + `</p>
                                    </div>
                                    <div class="card-action">
                                        <a href="#">` + p.skus[0].length + ` SKUS</a>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>`
                }).join();
    
 

}

    //calcula o numero de skus existentes
    function somaSKU() {
        new Promise(
            function(resolve,reject){
                console.log("vai calcular sku")
                var ssk = 0;
                database.categorias.forEach(function(c){
                    c.subcategorias.forEach(function(s){
                        s.produtos.forEach(function(p){
                            ssk +=p.skus[0].length
                        })
                    })
                })
                resolve(ssk)
            }
        )
            .then(function (resolved) {
                // yay, you got a new phone
                console.log(resolved);
                totalSkus = resolved
                document.getElementById("total-geral-skus").innerText = resolved + " SKUS"
            })
            .catch(function (rejected) {
                // ops, mom don't buy it
                console.log(rejected.message);
            });
    };
    


    //******** fim calculo skus *********/



function showProdutos(categoria, subcategoria){
    console.log("cliquei na subcategoria " + subcategoria)
    var prodCount = 0;
    var div = document.getElementById("subcat-detail")
    document.getElementById("lista-categorias").classList.add("hide");
    div.classList.remove("hide");
    var detalhe = 
    `
    <nav>
        <div class="nav-wrapper grey">
            <div class="row">
                    <div class="col s9 m9 l9">
                        <a href="#!" class="breadcrumb">` + categoria + `</a>
                        <a href="#!" class="breadcrumb">` + subcategoria + `</a>
                    </div>
                    <div class="col s3 m3 l3">
                        <a class="waves-effect waves-light btn orange" onclick="visualizaInicio()">VOLTAR</a>
                    </div>
            </div>
        </div>
    </nav>
    
    <div class="row">
        <div class="col s9"><H3>` + subcategoria + `</H3></div>
        <div class="col s3"><H5 id="total-produtos" class="blue-text text-darken-2"></H5></div>
        
    </div>
    `
    var p = new Promise(
        function(resolve,reject){
            database.categorias.forEach(function(c){
                c.subcategorias.forEach(function(s){
                    if(s.descricao === subcategoria){
                        console.log("na promessa > ")
                        console.log(s.produtos)
                        if(s.produtos.length > 0){
                            // not empty 
                            prodCount = s.produtosCount;
                            resolve(s.produtos)
                        } else {
                            // empty
                            var htmlNoProdutos = `<span class="new badge" >Não existem produtos CONSTRUE para essa subcategoria.</span>`
                            reject(htmlNoProdutos)
                        }
                    }
                })
            })
  
        }
    
    ).then(function(resolved){
            console.log("no then");
            console.log(resolved)
            div.innerHTML= detalhe + montaCardsDeProdutos(resolved);
            document.getElementById("total-produtos").innerHTML =  prodCount + "  Produtos Construe"
            
    })
    .catch(function(rejected){
         return div.innerHTML=detalhe + rejected;
    });

}  
    

function visualizaInicio(){
    document.getElementById("lista-categorias").classList.remove('hide');
    document.getElementById("subcat-detail").classList.add('hide');
}


function cardHTML(bootstrapClass,title,number,txtIcon,linkTo){

    //txtIcon = fa-comments

    return `
    <div class="col-lg-3 col-md-6">
            <div class="panel ` + bootstrapClass + ` ">
                <div class="panel-heading">
                    <div class="row">
                        <div class="col-xs-3">
                            <i class="fa ` + txtIcon + ` fa-4x"></i>
                        </div>
                        <div class="col-xs-9 text-right">
                            <div class="huge">`+ number + `</div>
                            <div>`+ title + `</div>
                        </div>
                    </div>
                </div>
                <a href="`+ linkTo + `">
                    <div class="panel-footer">
                        <span class="pull-left">Detalhe</span>
                        <span class="pull-right"><i class="fa fa-arrow-circle-right"></i></span>
                        <div class="clearfix"></div>
                    </div>
                </a>
            </div>
    </div>        
    `

}

