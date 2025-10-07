import EnterpriseCard from "@/components/EnterpriseCard";

const contacts = [
  {
    id: 1,
    name: "Addis Car",
    subtitle: "temsgen",
    phone: "+251921280194",
    email: "temsgenselam00@gmail.com",
    address: "Mexico, KCare Building",
    status: "ACTIVE" as const,
  },
  {
    id: 2,
    name: "Magnus Car Import and Sales",
    subtitle: "HHHHHH",
    phone: "09089876",
    email: "henokabebe5522@gmail.com",
    address: "Bole, Atlas",
    status: "ACTIVE" as const,
  },
  {
    id: 3,
    name: "Altaye Car",
    subtitle: "Temesgen Getye",
    phone: "+251920240194",
    email: "temsgenselam1995@gmail.com",
    address: "Bole, Gazebo",
    status: "ACTIVE" as const,
  },
  {
    id: 4,
    name: "GTR Cars",
    subtitle: "Yonas Workneh",
    phone: "+251986261979",
    email: "yonas.workneh.d@gmail.com",
    address: "Megnagna Salite Mehiret",
    status: "ACTIVE" as const,
  },
];

export default function ContactsPage() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-foreground mb-2">
          Enterprise plans
        </h1>
        <p className="text-muted-foreground">
          Manage enterprises — monitor access & activities of enterprise plan
          users.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {contacts.map((contact) => (
          <EnterpriseCard key={contact.id} contact={contact} />
        ))}
      </div>
    </div>
  );
}
