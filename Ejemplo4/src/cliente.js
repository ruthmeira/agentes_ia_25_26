// el fichero cliente lanzara peticiones a la API REST

const traerPostVinos = async () => {
    try {
        const response = await fetch('http://192.168.70.145:4000/posts');
        const data = await response.json();
        console.log(data);
    } catch (error) {
       console.error('Error al atraer los posts:', error); 
    }
};

traerPostVinos();
