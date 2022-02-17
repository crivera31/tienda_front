  /**variables */
  let total_reg = 0;
  let desde = 0;
  // let url_base = 'https://bsale-tienda.herokuapp.com/';
  let url_base = 'http://localhost:3005/';
  let idCategoria = 0;

  /** buscar si presiona tecla ENTER*/
  $(document).on('keypress',function(e) {
    if(e.which == 13) {
      //console.log($('#search').val());
      e.preventDefault();
      if ($('#search').val()) {
        let bloque = '<h4>Resultados de la búsqueda para: <span class="badge badge-secondary">'+$('#search').val()+'</span></h4>';
        $("#resultado").html(bloque);
      searchProducts($('#search').val());
      $('#search').val('')
      } else {
        getProducts(desde);
      }
    }
  });

  $("#btn_buscar").click(function() {
    if ($('#search').val()) {
      let bloque = '<h4>Resultados de la búsqueda para: <span class="badge badge-secondary">'+$('#search').val()+'</span></h4>';
      $("#resultado").html(bloque);
    searchProducts($('#search').val());
    $('#search').val('')
    } else {
      getProducts(desde);
    }
  });

  getProducts();
  getCategories();

/**FUNCION LISTAR LOS PRODUCTOS YA PAGINADOS 
 * recibe el parámetro por default DESDE=0 y va cambiando DESDE en el front de 6 en 6(datos a mostrar por pagina)
*/
function getProducts(desde = 0) {
  $("#resultado").html("");
  const params = new URLSearchParams({
    desde: desde
  });
  let url = url_base + `api/products?${params}`;
  fetch(url, {
      method: 'GET'
    })
    .then(function (response) {
      if (response.status !== 200) {
        Swal.fire("Error del servidor.","","error");
        console.log(
          "Looks like there was a problem. Status Code: " + response.status
        );
        return;
      }
      response.json().then(function (data) {
        let lstProduct = data.data.rows;
        total_reg = data.data.count;
        let template = "";

        lstProduct.forEach(data => {
          let image;
          if((typeof data.url_image) === 'string'){
            console.log('es string')
            if(data.url_image == '') {
              image = "image/image-not-found.png";
            } else {
              image = data.url_image;
            }
          }
          if((typeof data.url_image) === 'object'){
            image = "image/image-not-found.png";
            console.log(image)
          }
          // let image = (data.url_image != null) ? data.url_image : "image/image-not-found.png";
          template +=  ` 
          <div class="col-md-4">
          <div class="card mb-4 shadow-sm">
            <img src="${image}" width="100%" height="225">
            <div class="card-body">
              <p class="card-text" style="font-size: 0.68rem;">${data.name}</p>
              <div class="d-flex justify-content-between align-items-center">
                <div class="btn-group">
                  <a class="nav-item nav-link"><i class="fas fa-shopping-cart fa-lg" style="color: #06b9c0;"></i></a>
                </div>
                <small class="text-muted">$ ${data.price}</small>
              </div>
            </div>
          </div>
        </div>
          `;
        });
          $("#lstProducto").html(template);
      });
    })
    .catch(function (err) {
      Swal.fire("Error conexión del servidor.","","error");
    });
}
/**FUNCION QUE REALIZA EL PAGINADO, QUE SERAN 6 REGISTROS POR PAGINA
 * recibe el parametro VALOR desde el front(6 o -6)
*/
function changePage(valor) {
  desde += valor;
 if(desde < 0) {
    desde = 0;
  } else if(desde > total_reg) {
    Swal.fire("Ya no hay mas registros.");
    desde -= valor;
  }
  getProducts(desde);
}
/**FUNCION LISTAR LAS CATEGORIAS
 * en un select option
*/
function getCategories(){
  let url = url_base + `api/category`;
    fetch(url, {
      method: "GET"
    })
      .then(function(response) {
        if (response.status !== 200) {
          Swal.fire("Error del servidor.","","error");
          console.log(
            "Looks like there was a problem. Status Code: " + response.status
          );
          return;
        }
        response.json().then(function(data) {
          let lstCategories = data.data.rows;
          let template = "";
          lstCategories.forEach(data => {
            template += `<option value="${data.id}"> 
                            ${data.name} 
                      </option>`;
          });
          let cargar_template = `<option value="0" selected disabled>Escoger...</option>` + template;
            $("#category").html(cargar_template);
        });
      })
      .catch(function(err) {
        Swal.fire("Error del servidor","","error");
        console.log("Fetch Error: ", err);
      });
}
/**EVENTO PARA OBTENER EL ID DE LA CATEGORIA SELECCIONADA, Y MOSTRAR SUS PRODUCTOS */
$("#category").change(function() {
  $("#resultado").html("");
  idCategoria = $(this).val();

  const params = new URLSearchParams({
    id: idCategoria
  });
  let url = url_base + `api/products/category?${params}`;
    fetch(url, {
      method: "GET"
    })
      .then(function(response) {
        console.log(response);
        if (response.status !== 200) {
          $("#lstProducto").html('<p class="no_encontrado">No hay registros</p>');
          console.log(
            "Looks like there was a problem. Status Code: " + response.status
          );
          return;
        }
        response.json().then(function(data) {
          // console.log(data);
          let lstProduct = data.data.rows;
          let template = "";
          lstProduct.forEach(data => {
            let image;
          if((typeof data.url_image) === 'string'){
            console.log('es string')
            if(data.url_image == '') {
              image = "image/image-not-found.png";
            } else {
              image = data.url_image;
            }
          }
          if((typeof data.url_image) === 'object'){
            image = "image/image-not-found.png";
            console.log(image)
          }

            template +=  ` 
            <div class="col-md-4">
          <div class="card mb-4 shadow-sm">
            <img src="${image}" width="100%" height="225">
            <div class="card-body">
              <p class="card-text" style="font-size: 0.68rem;">${data.name}</p>
              <div class="d-flex justify-content-between align-items-center">
                <div class="btn-group">
                  <a class="nav-item nav-link"><i class="fas fa-shopping-cart fa-lg" style="color: #06b9c0;"></i></a>
                </div>
                <small class="text-muted">$ ${data.price}</small>
              </div>
            </div>
          </div>
        </div>
            `;
          });
            $("#lstProducto").html(template);
        });
      })
      .catch(function(err) {
        Swal.fire("Error del servidor.","","error");
        // console.log("Fetch Error: ", err);
      });
});
/** FUNCION BUSCAR PRODCUTO(S) CON EL CAMPO NAME EN LA DB */
function searchProducts(search) {
  console.log('dentro de la funcion: '+search);
  const params = new URLSearchParams({
      text: search
    });
    let url = url_base + `api/search?${params}`;
    fetch(url, {
      method: "GET"
    })
      .then(function(response) {
        console.log(response);
        if (response.status !== 200) {
          $("#lstProducto").html('<div class="alert alert-primary col-md-6 offset-md-4" style="text-align:center;" role="alert">No hay registros.</div>');
          console.log(
            "Looks like there was a problem. Status Code: " + response.status
          );
          return;
        }
        response.json().then(function(data) {
          let lstProduct = data.products;
          let template = "";
          lstProduct.forEach(data => {
            let image;
          if((typeof data.url_image) === 'string'){
            console.log('es string')
            if(data.url_image == '') {
              image = "image/image-not-found.png";
            } else {
              image = data.url_image;
            }
          }
          if((typeof data.url_image) === 'object'){
            image = "image/image-not-found.png";
            console.log(image)
          }

            template += ` 
            <div class="col-md-4">
          <div class="card mb-4 shadow-sm">
            <img src="${image}" width="100%" height="225">
            <div class="card-body">
              <p class="card-text" style="font-size: 0.68rem;">${data.name}</p>
              <div class="d-flex justify-content-between align-items-center">
                <div class="btn-group">
                  <a class="nav-item nav-link"><i class="fas fa-shopping-cart fa-lg" style="color: #06b9c0;"></i></a>
                </div>
                <small class="text-muted">$ ${data.price}</small>
              </div>
            </div>
          </div>
        </div>
            `;
          });
            $("#lstProducto").html(template);
        });
      })
      .catch(function(err) {
        Swal.fire("Error del servidor.","","error");
      });
}
/**EVENTO PARA EL FILTRADO DE PRODUCTO(S) POR EL RANGO DE PRECIO */
$( "#slider-range" ).slider({
  range: true,
  min: 100,
  max: 20000,
  values: [ 100, 20000 ],
  // change: function( event, ui ) {
  //   console.log(ui)
  // },
  change: function( event, ui ) {
    // console.log($( "#amount" ).val( "$" + ui.values[0] + " - $" + ui.values[1] ));
    let desde = ui.values[0];
    let hasta = ui.values[1];

    const params = new URLSearchParams({
      desde: desde,
      hasta: hasta
    });

    $("#resultado").html("");


    let url = url_base + `api/search/price?${params}`;
    fetch(url, {
      method: "GET"
    })
      .then(function(response) {
        if (response.status !== 200) {
          $("#lstProducto").html('<div class="alert alert-primary col-md-6 offset-md-4" style="text-align:center;" role="alert">No hay registros.</div>');
          console.log(
            "Looks like there was a problem. Status Code: " + response.status
          );
          return;
        }
        response.json().then(function(data) {
          let lstProduct = data.products;
          let template = "";
          lstProduct.forEach(data => {
            let image;
          if((typeof data.url_image) === 'string'){
            console.log('es string')
            if(data.url_image == '') {
              image = "image/image-not-found.png";
            } else {
              image = data.url_image;
            }
          }
          if((typeof data.url_image) === 'object'){
            image = "image/image-not-found.png";
            console.log(image)
          }
            template +=  ` 
            <div class="col-md-4">
          <div class="card mb-4 shadow-sm">
            <img src="${image}" width="100%" height="225">
            <div class="card-body">
              <p class="card-text" style="font-size: 0.68rem;">${data.name}</p>
              <div class="d-flex justify-content-between align-items-center">
                <div class="btn-group">
                  <a class="nav-item nav-link"><i class="fas fa-shopping-cart fa-lg" style="color: #06b9c0;"></i></a>
                </div>
                <small class="text-muted">$ ${data.price}</small>
              </div>
            </div>
          </div>
        </div>
            `;
          });
            $("#lstProducto").html(template);
        });
      })
      .catch(function(err) {
        Swal.fire("Error del servidor.","","error");
      });
  }
});


$( "#amount" ).val( "$" + $( "#slider-range" ).slider( "values", 0 ) +
  " - $" + $( "#slider-range" ).slider( "values", 1 ) );