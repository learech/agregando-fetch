
const contenedorProductos = document.getElementById('contenedor-productos')

const contenedorCarrito = document.getElementById('carrito-contenedor')

const botonVaciar = document.getElementById('vaciar-carrito')

const contadorCarrito = document.getElementById('contadorCarrito')

const cantidad = document.getElementById('cantidad')

const precioTotal = document.getElementById('precioTotal')



let carrito = []

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('carrito')){
        carrito = JSON.parse(localStorage.getItem('carrito'))
        actualizarCarrito()
    }
})

botonVaciar.addEventListener('click', () => {
   
    carrito.length = 0
    actualizarCarrito()
   
})


function mostrarProductos(){

   

    fetch('stock.json')
   .then((response) => response.json())
   .then((data) => {
  	

    data.forEach((producto) => {

        const div = document.createElement('div')
            div.classList.add('producto')
            div.innerHTML = `
            <img src=${producto.img} alt= "">
            <h3>${producto.nombre}</h3>
            <p>${producto.desc}</p>
            <p>Color: ${producto.color}</p>
            <p class="precioProducto">Precio:$ ${producto.precio}</p>
            <button id="agregar${producto.id}" class="boton-agregar">Agregar <i class="fas fa-shopping-cart"></i></button>`
        

    contenedorProductos.appendChild(div)

    const boton = document.getElementById(`agregar${producto.id}`)
    boton.addEventListener('click', () => {
        
        agregarAlCarrito(producto.id)
        
        swal({
            title: 'Excelente!!',
            text: 'Tu producto fue agregado al carrito!',
            icon: 'success',
            buttons: false,
            timer: 1300
        })

        
    }) 
 })
 }).catch(console.error);
 
}


mostrarProductos()



const agregarAlCarrito = (prodId) => {

    const existe = carrito.some (prod => prod.id === prodId)

    if (existe){ 
        const prod = carrito.map (prod => {
            if (prod.id === prodId){
                prod.cantidad++
            }actualizarCarrito()
        })
    } else {
        fetch('stock.json')
        .then((response) => response.json())
        .then((data) => {
                
    
    const item = data.find((prod) => prod.id == prodId)
    carrito.push(item)
    localStorage.setItem("carrito", JSON.stringify(carrito))
    actualizarCarrito() 

    
    })      

    } 

}

const eliminarDelCarrito = (prodId) => {
    swal({
        title: '¿Esta seguro de eliminar el producto?',
        icon: 'warning',
        buttons: true,
        dangerMode: true,
    }).then( result => {
        if (result) {
            swal({
                title: 'Eliminado!',
                icon: 'success',
                text: 'El producto fue eliminado con éxito'

            })
        }
    } ) 
   
    const item = carrito.find((prod) => prod.id === prodId)

    const indice = carrito.indexOf(item) 

    carrito.splice(indice, 1)
    actualizarCarrito()
    console.log(carrito)
   
}

const actualizarCarrito = () => {
    contenedorCarrito.innerHTML = ""

    carrito.forEach((prod) => {
        const div = document.createElement('div')
        div.className = ('productoEnCarrito')
        div.innerHTML = `
        <p>${prod.nombre}</p>
        <p>Precio:$${prod.precio}</p>
        <p>Cantidad: <span id="cantidad">${prod.cantidad}</span></p>
        <button onclick="eliminarDelCarrito(${prod.id})" class="boton-eliminar"><i class="fas fa-trash-alt"></i></button>
        `

        contenedorCarrito.appendChild(div)
        
        localStorage.setItem('carrito', JSON.stringify(carrito))

    })
    
    contadorCarrito.innerText = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0)
    console.log(carrito)
    precioTotal.innerText = carrito.reduce((acc, prod) => acc + prod.cantidad * prod.precio, 0)


}
