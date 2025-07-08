using Microsoft.AspNetCore.SignalR;

namespace PortfolioService.Hubs
{
    public class PortfolioHub:Hub
    {
        public override async Task OnConnectedAsync()
        {
            Console.WriteLine($"--> SignalR client connected: {Context.ConnectionId}");
            await base.OnConnectedAsync();
        }
    }
}
