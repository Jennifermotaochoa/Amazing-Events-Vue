console.log("Hola")
const {createApp} = Vue;

const app = createApp({
    data(){
        return{
            eventos: [],
            categorias: [],
            valorBusqueda: "",
            checked: [],
            eventosFiltrados: [],
            eventoSelecionado: [],
            eventosFuturos: [],
            eventosFuturosFiltrados: [],
            eventosPasados: [],
            eventosPasadosFiltrados: [],

            eventosPasadosPorcentaje: [],
            eventosPasadosCapacidad: [],

            categoriasFuturas: [],
            listaCategoriasFuturas:[],
            categoriasFuturasDatos: [],

            categoriasPasadas: [],
            listaCategoriasPasadas: [],
            categoriasPasadasDatos: [],
        }
    },
    created(){
        fetch("https://mindhub-xj03.onrender.com/api/amazing")
            .then(response => response.json())
            .then((data) =>{         
                this.eventos = data.events
                console.log(data)

                this.categorias = Array.from(new Set(data.events.map(evento => evento.category)))

                this.eventosFiltrados = this.eventos
                console.log(this.categorias)

                const params = new URLSearchParams(location.search);

                const id = params.get("id")

                this.eventoSelecionado = data.events.find(element => element._id == id)

                this.eventosFuturos = this.eventos.filter(evento => evento.date > data.currentDate)
                console.log(this.eventosFuturos)

                this.eventosPasados = this.eventos.filter(evento => evento.date < data.currentDate)
                console.log(this.eventosPasados)

                //-----------Tabla 1------------//
                this.eventosPasados.map(evento => {
                    let assistance = evento.assistance
                    let capacity = evento.capacity
                    let porcentage = ((assistance / capacity) * 100).toFixed()
                    evento.porcentage = porcentage
                })
                this.eventosPasadosPorcentaje = this.eventosPasados.sort((a, b) => b.porcentage - a.porcentage)
                console.log(this.eventosPasadosPorcentaje)
                this.eventosPasadosCapacidad = this.eventos.filter(evento => evento.capacity).sort((a, b) => b.capacity - a.capacity)
                console.log(this.eventosPasadosCapacidad)

                //---------------- Tabla 2 -------------//
                this.categoriasFuturas = Array.from(new Set(this.eventosFuturos.map(evento => evento.category)))
                console.log(this.categoriasFuturas)

                this.categoriasFuturas.map(category => 
                    this.listaCategoriasFuturas.push({
                    category: category,
                    event: this.eventosFuturos.filter(event => event.category === category)
                }))
                console.log(this.listaCategoriasFuturas)

                this.listaCategoriasFuturas.map(datos => {
                    this.categoriasFuturasDatos.push({
                        category: datos.category,
                        estimate: datos.event.map(item => item.estimate),
                        capacity: datos.event.map(item => item.capacity),
                        estimateRevenue: datos.event.map(item => item.estimate * item.price)
                    })
                })
                console.log(this.categoriasFuturasDatos)

                this.categoriasFuturasDatos.forEach(category => {
                    let totalEstimate = 0;
                    category.estimate.forEach(estimate => totalEstimate += Number(estimate));
                    category.estimate = totalEstimate;
            
                    let totalCapacityFuturos = 0;
                    category.capacity.forEach(capacity => totalCapacityFuturos += Number(capacity));
                    category.capacity = totalCapacityFuturos;
            
                    let totalEstimateRevenue = 0;
                    category.estimateRevenue.forEach(estimateRevenue => totalEstimateRevenue += Number(estimateRevenue));
                    category.estimateRevenue = totalEstimateRevenue;
            
                    category.porcentajeAttendace = ((totalEstimate * 100) / totalCapacityFuturos).toFixed();
                })
                console.log(this.categoriasFuturasDatos)

                //------------ TABLA 3 -----------//
                this.categoriasPasadas = Array.from(new Set(this.eventosPasados.map(evento => evento.category)))
                console.log(this.categoriasPasadas)

                this.categoriasPasadas.map(category => 
                    this.listaCategoriasPasadas.push({
                    category: category,
                    event: this.eventosPasados.filter(event => event.category === category)
                }))
                console.log(this.listaCategoriasPasadas)

                this.listaCategoriasPasadas.map(datos => {
                    this.categoriasPasadasDatos.push({
                        category: datos.category,
                        assistance: datos.event.map(item => item.assistance),
                        capacity: datos.event.map(item => item.capacity),
                        revenue: datos.event.map(item => item.assistance * item.price)
                    })
                })
                console.log(this.categoriasPasadasDatos)

                this.categoriasPasadasDatos.forEach(category => {
                    let totalAssistance = 0;
                    category.assistance.forEach(assistance => totalAssistance += Number(assistance));
                    category.assistance = totalAssistance;
            
                    let totalCapacityPasados = 0;
                    category.capacity.forEach(capacity => totalCapacityPasados += Number(capacity));
                    category.capacity = totalCapacityPasados;
            
                    let totalRevenue = 0;
                    category.revenue.forEach(revenue => totalRevenue += Number(revenue));
                    category.estimateRevenue = totalRevenue;
            
                    category.porcentajeAttendace = ((totalAssistance * 100) / totalCapacityPasados).toFixed();
                });
                console.log(this.categoriasPasadasDatos);
            })
            .catch(error => console.log(error))
    },
    computed: {
        filtro(){
            let filtradoBusqueda = this.eventos.filter(evento => evento.name.toLowerCase().includes( this.valorBusqueda.toLowerCase()))
            let filtradoCheck = filtradoBusqueda.filter( evento => this.checked.includes( evento.category) || this.checked.length == 0 )
            this.eventosFiltrados = filtradoCheck
        },
        filtrarEventosFuturos(){
            let filtradoBusqueda = this.eventosFuturos.filter(evento => evento.name.toLowerCase().includes( this.valorBusqueda.toLowerCase()))
            let filtradoCheck = filtradoBusqueda.filter( evento => this.checked.includes( evento.category) || this.checked.length == 0 )
            this.eventosFiltrados = filtradoCheck
            this.eventosFuturosFiltrados = filtradoCheck
            console.log(this.eventosFuturosFiltrados)
        },
        filtrarEventosPasados(){
            let filtradoBusqueda = this.eventosPasados.filter(evento => evento.name.toLowerCase().includes( this.valorBusqueda.toLowerCase()))
            let filtradoCheck = filtradoBusqueda.filter( evento => this.checked.includes( evento.category) || this.checked.length == 0 )
            this.eventosFiltrados = filtradoCheck
            this.eventosPasadosFiltrados = filtradoCheck
            console.log(this.eventosPasadosFiltrados)   
        },
    }
})
app.mount("#app");