namespace FinWiseNest.Data.Messaging
{
    public interface IMessageService
    {
        Task PublishMessageAsync<T> (string topicName, T message);
    }
}
