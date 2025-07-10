using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace MarketDataService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MarketDataController:ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;
        public MarketDataController(IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
        }

        [HttpGet("price/{ticker}")]
        public async Task<ActionResult> GetRealTimePrice(string ticker) 
        {
            var apiKey = _configuration["FinancialModelingPrep:ApiKey"];
            var client = _httpClientFactory.CreateClient();
            var url = $"https://financialmodelingprep.com/api/v3/quote-short/{ticker.ToUpper()}?apikey={apiKey}";

            try
            {
                var response = await client.GetAsync(url);
                if (!response.IsSuccessStatusCode)
                {
                    return StatusCode((int)response.StatusCode, "Failed to fetch data from FMP API.");
                }
                var json = await response.Content.ReadAsStringAsync();
                var data = JsonSerializer.Deserialize<JsonElement[]>(json);

                if(data==null || data.Length == 0)
                {
                    return NotFound($"No data found for ticker: {ticker}");
                }

                var price = data[0].GetProperty("price").GetDecimal();
                return Ok(new {ticker, price});
            }
            catch (Exception exp)
            {
                return StatusCode(500, $"An error occured: {exp.Message}");
            }
        }
    }
}
