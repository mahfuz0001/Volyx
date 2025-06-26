// Mock data for the Volyx auction app
export interface AuctionItem {
  id: string;
  title: string;
  description: string;
  image: string;
  currentBid: number;
  minimumBid: number;
  endTime: Date;
  category: string;
  isHot: boolean;
  isFavorite: boolean;
  bidHistory: BidHistoryItem[];
}

export interface BidHistoryItem {
  id: string;
  userId: string;
  amount: number;
  timestamp: Date;
}

export interface ConnectsTransaction {
  id: string;
  type: 'earned' | 'spent' | 'purchased';
  amount: number;
  description: string;
  timestamp: Date;
}

export interface WonItem {
  id: string;
  title: string;
  image: string;
  winningBid: number;
  wonAt: Date;
}

// Generate future dates for auction end times
const now = new Date();
const addHours = (hours: number) => new Date(now.getTime() + hours * 60 * 60 * 1000);
const addMinutes = (minutes: number) => new Date(now.getTime() + minutes * 60 * 1000);

export const mockAuctionItems: AuctionItem[] = [
  {
    id: '1',
    title: 'Vintage Leather Messenger Bag',
    description: 'Handcrafted Italian leather messenger bag with brass hardware. Perfect for professionals who appreciate timeless style.',
    image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800',
    currentBid: 450,
    minimumBid: 460,
    endTime: addMinutes(45),
    category: 'Fashion',
    isHot: true,
    isFavorite: false,
    bidHistory: [
      { id: '1', userId: 'User***234', amount: 400, timestamp: addMinutes(-30) },
      { id: '2', userId: 'User***567', amount: 425, timestamp: addMinutes(-15) },
      { id: '3', userId: 'User***890', amount: 450, timestamp: addMinutes(-5) },
    ],
  },
  {
    id: '2',
    title: 'Premium Wireless Headphones',
    description: 'Studio-quality wireless headphones with active noise cancellation and 30-hour battery life.',
    image: 'https://images.pexels.com/photos/3783471/pexels-photo-3783471.jpeg?auto=compress&cs=tinysrgb&w=800',
    currentBid: 320,
    minimumBid: 330,
    endTime: addHours(2),
    category: 'Electronics',
    isHot: false,
    isFavorite: true,
    bidHistory: [
      { id: '1', userId: 'User***123', amount: 280, timestamp: addHours(-4) },
      { id: '2', userId: 'User***456', amount: 300, timestamp: addHours(-2) },
      { id: '3', userId: 'User***789', amount: 320, timestamp: addMinutes(-30) },
    ],
  },
  {
    id: '3',
    title: 'Rare Comic Book Collection',
    description: 'First edition comic books from the golden age, professionally graded and authenticated.',
    image: 'https://images.pexels.com/photos/1337247/pexels-photo-1337247.jpeg?auto=compress&cs=tinysrgb&w=800',
    currentBid: 1250,
    minimumBid: 1260,
    endTime: addMinutes(15),
    category: 'Collectibles',
    isHot: true,
    isFavorite: false,
    bidHistory: [
      { id: '1', userId: 'User***111', amount: 1000, timestamp: addHours(-1) },
      { id: '2', userId: 'User***222', amount: 1150, timestamp: addMinutes(-45) },
      { id: '3', userId: 'User***333', amount: 1250, timestamp: addMinutes(-10) },
    ],
  },
  {
    id: '4',
    title: 'Professional Camera Lens',
    description: '85mm f/1.4 professional portrait lens compatible with Canon EF mount. Perfect for stunning portraits.',
    image: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800',
    currentBid: 890,
    minimumBid: 900,
    endTime: addHours(4),
    category: 'Electronics',
    isHot: false,
    isFavorite: true,
    bidHistory: [
      { id: '1', userId: 'User***444', amount: 800, timestamp: addHours(-3) },
      { id: '2', userId: 'User***555', amount: 850, timestamp: addHours(-1) },
      { id: '3', userId: 'User***666', amount: 890, timestamp: addMinutes(-20) },
    ],
  },
  {
    id: '5',
    title: 'Artisan Coffee Brewing Set',
    description: 'Complete pour-over coffee brewing set with ceramic dripper, gooseneck kettle, and premium filters.',
    image: 'https://images.pexels.com/photos/1251175/pexels-photo-1251175.jpeg?auto=compress&cs=tinysrgb&w=800',
    currentBid: 185,
    minimumBid: 195,
    endTime: addHours(6),
    category: 'Lifestyle',
    isHot: false,
    isFavorite: false,
    bidHistory: [
      { id: '1', userId: 'User***777', amount: 150, timestamp: addHours(-2) },
      { id: '2', userId: 'User***888', amount: 175, timestamp: addHours(-1) },
      { id: '3', userId: 'User***999', amount: 185, timestamp: addMinutes(-40) },
    ],
  },
  {
    id: '6',
    title: 'Limited Edition Sneakers',
    description: 'Exclusive sneaker collaboration with certificate of authenticity. Size 10 US.',
    image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800',
    currentBid: 650,
    minimumBid: 660,
    endTime: addHours(8),
    category: 'Fashion',
    isHot: true,
    isFavorite: false,
    bidHistory: [
      { id: '1', userId: 'User***101', amount: 500, timestamp: addHours(-5) },
      { id: '2', userId: 'User***202', amount: 600, timestamp: addHours(-2) },
      { id: '3', userId: 'User***303', amount: 650, timestamp: addMinutes(-60) },
    ],
  },
];

export const mockConnectsTransactions: ConnectsTransaction[] = [
  {
    id: '1',
    type: 'purchased',
    amount: 1500,
    description: 'Purchased 1500 Connects Bundle',
    timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    id: '2',
    type: 'spent',
    amount: -450,
    description: 'Bid on Vintage Leather Messenger Bag',
    timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: '3',
    type: 'earned',
    amount: 25,
    description: 'Watched video advertisement',
    timestamp: new Date(now.getTime() - 12 * 60 * 60 * 1000), // 12 hours ago
  },
  {
    id: '4',
    type: 'spent',
    amount: -320,
    description: 'Bid on Premium Wireless Headphones',
    timestamp: new Date(now.getTime() - 8 * 60 * 60 * 1000), // 8 hours ago
  },
  {
    id: '5',
    type: 'earned',
    amount: 25,
    description: 'Watched video advertisement',
    timestamp: new Date(now.getTime() - 4 * 60 * 60 * 1000), // 4 hours ago
  },
];

export const mockWonItems: WonItem[] = [
  {
    id: '1',
    title: 'Smart Watch Series 7',
    image: 'https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=800',
    winningBid: 380,
    wonAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
  },
  {
    id: '2',
    title: 'Ceramic Planter Set',
    image: 'https://images.pexels.com/photos/1005058/pexels-photo-1005058.jpeg?auto=compress&cs=tinysrgb&w=800',
    winningBid: 125,
    wonAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
  },
];

export const mockCategories = [
  { id: '1', name: 'Electronics', icon: '📱' },
  { id: '2', name: 'Fashion', icon: '👕' },
  { id: '3', name: 'Collectibles', icon: '🎨' },
  { id: '4', name: 'Lifestyle', icon: '🏠' },
  { id: '5', name: 'Sports', icon: '⚽' },
  { id: '6', name: 'Books', icon: '📚' },
];

// Mock user data
export const mockUserData = {
  connectsBalance: 2750,
  name: 'John Doe',
  email: 'john.doe@example.com',
  joinedDate: new Date('2024-01-15'),
  totalBids: 47,
  itemsWon: 8,
};