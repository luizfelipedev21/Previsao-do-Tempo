const Key_image = "7EkojGa_QPBB_DcMG7Id5IALCADYqz8ZxVMKg8mvP-I";
const search_button = document.getElementById('button-searching');
const input_city = document.getElementById('input-city');
const message_error = document.getElementById('error-message');
const city_name = document.getElementById('city-name');
const temperature = document.getElementById("temperature-city");
const value_temperature = document.getElementById("value-temperature");
const condition = document.getElementById("condition");
const humidity = document.getElementById('humidity-value');
const  kmh = document.getElementById('wind-value');
const weather_Info = document.getElementById("info");


const Codes_map = {
0: 'Céu limpo',
  1: 'Predominantemente limpo',
  2: 'Parcialmente nublado',
  3: 'Ensolarado/Nublado',
  45: 'Névoa',
  48: 'Sarrafo / Geada',
  51: 'Garoa leve',
  53: 'Garoa moderada',
  55: 'Garoa densa',
  61: 'Chuva leve',
  63: 'Chuva moderada',
  65: 'Chuva forte',
  80: 'Pancadas de chuva leves',
  81: 'Pancadas de chuva moderadas',
  82: 'Pancadas de chuva violentas',
  95: 'Tempestade'
}

async function updateBackgroundImage(Name_city){
    try{
        const Url_photo = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(Name_city)}&orientation=landscape&client_id=${Key_image}`;
        const response = await fetch(Url_photo);
        if(!response.ok ) return;
        const data = await response.json();

        if(data && data.urls && data.urls.regular){
            document.body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('${data.urls.regular}')`;
        }
    }catch(error){
           console.log("Não foi possível carregar a imagem de fundo:", error);
  
    }
}

async function getWeather(city) {
    try{
      
        
        const geoUrl =`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=pt&format=json`;
        const geoRes = await fetch(geoUrl);
        const geoData = await geoRes.json();

        if(!geoData.results || geoData.results.length === 0)
            {
            throw new Error("Cidade não encontrada!");
        }
        const {latitude, longitude, name, country} = geoData.results[0];
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`;
    const weatherRes = await fetch(weatherUrl);
    const weatherData = await weatherRes.json();

    const current = weatherData.current;

     city_name.textContent = `${name}, ${country}`
     value_temperature.textContent = Math.round(current.temperature_2m)
     humidity.textContent = `${current.relative_humidity_2m}%`
    kmh.textContent = `${Math.round(current.wind_speed_10m)} km/h`;

    const code = current.weather_code;
    condition.textContent = Codes_map[code] || 'Condição desconhecida';

    updateBackgroundImage(name);
        
    } catch (error){
     console.log(error) 
     Swal.fire({
        icon: 'error',
        title: 'Ops..',
        text: message_error || "Ocorreu um error Cidade não encontrada!"    ,
        confirmButtonColor: '#00d2ff', // Cor do botão ajustada ao tema do app
        confirmButtonText: 'Entendido'  
     })
       
        
    }
}

search_button.addEventListener('click', () => {
    const city = input_city.value.trim();
    if(city) {
        getWeather(city);

    } else{
        Swal.fire({
      icon: 'warning',
      title: 'Campo vazio',
      text: 'Por favor, digite o nome de uma cidade.',
      confirmButtonColor: '#00d2ff',
      confirmButtonText: 'OK'
    });

    }
   
})
 input_city.addEventListener('keypress', () =>{
        if(event.key === "Enter"){
            search_button.click()
        }
    })