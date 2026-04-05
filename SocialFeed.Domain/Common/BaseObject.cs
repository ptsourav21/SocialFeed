namespace SocialFeed.Domain
{
    public class BaseObject
    {
        public Guid ID { get; set; } = Guid.NewGuid();
        public DateTime CreatedTime { get; set; }
        public Guid CreatedBy { get; set; }
        public DateTime? ModifiedTime { get; set; }
        public Guid? ModifiedBy { get; set; }
        public EnumStatus Status { get; set; } = EnumStatus.Active;
    }
}
