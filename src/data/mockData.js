import { subDays } from 'date-fns';

const CATEGORIES = ['ORTOPEDICO', 'DESPENSA', 'PAÑALES', 'TOALLAS HUMEDAS', 'EXTRAORDINARIO', 'CONSULTA'];

const mockItems = [
  {
    _id: '1',
    category: 'ORTOPEDICO',
    description: 'Silla de ruedas',
    approxPrice: 2500,
    active: true,
    deleted: false,
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '2',
    category: 'DESPENSA',
    description: 'Paquete básico de alimentos',
    approxPrice: 500,
    active: true,
    deleted: false,
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '3',
    category: 'PAÑALES',
    description: 'Pañales adulto',
    approxPrice: 300,
    active: true,
    deleted: false,
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const mockBeneficiaries = [
  { _id: '1', name: 'John Doe' },
  { _id: '2', name: 'Jane Smith' }
];

export const generateMockData = () => {
  const data = [];
  
  for (let i = 365; i >= 0; i--) {
    const date = subDays(new Date(), i);
    const numItems = Math.floor(Math.random() * 3) + 1;
    const items = Array.from({ length: numItems }, () => 
      mockItems[Math.floor(Math.random() * mockItems.length)]
    );

    data.push({
      _id: `contribution-${i}`,
      contributionItems: items.map(item => ({
        contributionItem: item,
        quantity: Math.floor(Math.random() * 5) + 1
      })),
      beneficiary: mockBeneficiaries[Math.floor(Math.random() * mockBeneficiaries.length)],
      contributionDate: date,
      comments: `Sample contribution ${i}`,
      active: true,
      deleted: false,
      createdBy: 'system',
      createdAt: date,
      updatedAt: date
    });
  }
  
  return data;
};

export const getCategoryColor = (category) => {
  const colors = {
    'ORTOPEDICO': '#2563eb',
    'DESPENSA': '#16a34a',
    'PAÑALES': '#9333ea',
    'TOALLAS HUMEDAS': '#c026d3',
    'EXTRAORDINARIO': '#ea580c',
    'CONSULTA': '#0891b2'
  };
  return colors[category];
};