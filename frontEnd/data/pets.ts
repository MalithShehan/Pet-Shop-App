export type PetItem = {
  id: string;
  name: string;
  category: 'Dog' | 'Cat' | 'Bird';
  price: number;
  image: string;
  description: string;
};

export const pets: PetItem[] = [
  {
    id: 'dog-1',
    name: 'Golden Retriever Puppy',
    category: 'Dog',
    price: 799.0,
    image:
      'https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?auto=format&fit=crop&w=900&q=80',
    description: 'Friendly and playful companion, perfect for family homes and daily walks.',
  },
  {
    id: 'cat-1',
    name: 'Persian Kitten',
    category: 'Cat',
    price: 649.0,
    image:
      'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&w=900&q=80',
    description: 'Calm and affectionate kitten with silky fur and gentle personality.',
  },
  {
    id: 'bird-1',
    name: 'Sun Conure',
    category: 'Bird',
    price: 399.0,
    image:
      'https://images.unsplash.com/photo-1591198936750-16d8e15edb9e?auto=format&fit=crop&w=900&q=80',
    description: 'Colorful and social bird with a lively, curious personality and bright energy.',
  },
  {
    id: 'dog-2',
    name: 'Beagle Puppy',
    category: 'Dog',
    price: 699.0,
    image:
      'https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=900&q=80',
    description: 'Energetic and curious puppy that loves active play and outdoor adventures.',
  },
  {
    id: 'cat-2',
    name: 'Scottish Fold',
    category: 'Cat',
    price: 589.0,
    image:
      'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=900&q=80',
    description: 'Sweet and cuddly cat with adorable folded ears and calm behavior.',
  },
  {
    id: 'bird-2',
    name: 'Cockatiel',
    category: 'Bird',
    price: 279.0,
    image:
      'https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=900&q=80',
    description: 'Gentle and affectionate bird known for whistles and playful interaction.',
  },
];

export const categories = ['All', 'Dog', 'Cat', 'Bird'] as const;
