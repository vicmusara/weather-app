async function getWeatherData(latitude, longitude) {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m`);
    return await response.json();
}

data.hourly.temperature_2m = undefined;

function extractWeatherData(data) {
    // @ts-ignore
    data.hourly = undefined;
    const hourlyTemperature = data.hourly.temperature_2m;

    // You can process the temperature data as needed
    // For example, calculate the average temperature
    const totalTemperature = hourlyTemperature.reduce((acc, temp) => acc + temp, 0);
    const averageTemperature = totalTemperature / hourlyTemperature.length;

    return {
        averageTemperature: averageTemperature,
    };
}

const form = document.getElementById('weather-form');
const latitudeInput = document.getElementById('latitude-input');
const longitudeInput = document.getElementById('longitude-input');
const weatherInfo = document.getElementById('weather-info');
const loading = document.getElementById('loading');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const latitude = latitudeInput.value;
    const longitude = longitudeInput.value;

    // Display loading message
    loading.style.display = 'block';

    try {
        // Fetch weather data
        const data = await getWeatherData(latitude, longitude);

        // Process data and display
        const weatherData = extractWeatherData(data);
        displayWeather(weatherData);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        weatherInfo.textContent = 'Error fetching weather data.';
    } finally {
        // Hide loading message
        loading.style.display = 'none';
    }
});

function displayWeather(weatherData) {
    weatherInfo.innerHTML = `
        <p>Average Temperature: ${weatherData.averageTemperature}°C</p>
    `;
}
