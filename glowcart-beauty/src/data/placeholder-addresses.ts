export type PlaceholderAddress = {
  id: string;
  label: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  postalCode: string;
  isDefault: boolean;
};

export const placeholderAddresses: PlaceholderAddress[] = [
  {
    id: "addr_001",
    label: "Home",
    name: "Ayesha Rahman",
    phone: "+880 1712 345678",
    line1: "House 12, Road 5, Block C",
    line2: "Banani",
    city: "Dhaka",
    postalCode: "1213",
    isDefault: true,
  },
  {
    id: "addr_002",
    label: "Office",
    name: "Ayesha Rahman",
    phone: "+880 1712 345678",
    line1: "Level 8, Navana Tower",
    line2: "Gulshan Avenue",
    city: "Dhaka",
    postalCode: "1212",
    isDefault: false,
  },
];
