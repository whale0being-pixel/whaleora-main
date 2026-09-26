import { whatsappHref } from './contact';

export type FaqCategory =
  | 'choose'
  | 'alarm'
  | 'pepper'
  | 'whistle'
  | 'window'
  | 'orders'
  | 'legal'
  | 'care'
  | 'partnerships'
  | 'brand';

export type FaqLink = { label: string; href: string };

export type FaqEntry = {
  id: string;
  category: FaqCategory;
  question: string;
  answer: string;
  keywords: string[];
  followUps: string[];
  links?: FaqLink[];
  featured?: boolean;
};

export const faqCategories: { id: FaqCategory; label: string; prompt: string }[] = [
  { id: 'choose', label: 'Which tool', prompt: 'Help me pick the right one' },
  { id: 'alarm', label: 'SOS Alarm', prompt: 'How the 130dB alarm works' },
  { id: 'pepper', label: 'Pepper spray', prompt: 'Is pepper spray legal to carry?' },
  { id: 'whistle', label: 'Whistle', prompt: 'Tell me about the survival whistle' },
  { id: 'window', label: 'Window breaker', prompt: 'Tell me about the window breaker' },
  { id: 'orders', label: 'Orders', prompt: 'Shipping, returns and payments' },
  { id: 'legal', label: 'Travel & law', prompt: 'Can I take these on a flight?' },
  { id: 'care', label: 'Care', prompt: 'Battery, testing and storage' },
  { id: 'partnerships', label: 'Partnerships', prompt: 'Workshops for campuses and offices' },
  { id: 'brand', label: 'Whaleora', prompt: 'Who makes these, and why' },
];

export const faqs: FaqEntry[] = [
  {
    id: 'choose-which',
    category: 'choose',
    featured: true,
    question: 'Which personal safety tool should I buy?',
    answer:
      'The best tool is the one that seamlessly fits your everyday routine.\n\nFor daily commutes, late shifts, or campus walks, we highly recommend starting with the Personal SOS Alarm (₹1,799). It features a 130dB siren and strobe light to instantly draw attention. If you need a fail-safe backup for travel, the Survival Whistle (₹299) requires no battery and clips easily to any zipper.\n\nPepper spray (₹499) is ideal when you need to maintain physical distance, provided you keep it accessible in an outer pocket. The emergency window breaker (₹599) is strictly a transit tool—keep it in your car door pocket, not on your keys.',
    keywords: ['which', 'choose', 'pick', 'recommend', 'best', 'right one', 'should i buy', 'should i get', 'which one', 'starter', 'begin', 'first', 'kit', 'compare', 'difference', 'vs', 'versus', 'help me choose', 'self defense'],
    followUps: ['choose-alarm-vs-whistle', 'choose-kit', 'alarm-how', 'orders-shipping'],
    links: [
      { label: 'Compare all four', href: '/products' },
      { label: 'Start with the SOS Alarm', href: '/products/sos-alarm' },
    ],
  },
  {
    id: 'choose-alarm-vs-whistle',
    category: 'choose',
    question: 'What is the difference between the SOS alarm and the whistle?',
    answer:
      'Both are powerful acoustic safety tools designed to attract immediate help, but they work differently to ensure you are never left without options.\n\nThe Personal SOS Alarm is our loudest tool (130dB) and includes a flashing strobe light. It runs on a rechargeable Lithium-Ion battery (C-Type USB) and sounds continuously until you push the pin back in. \n\nThe Survival Whistle (120dB) is your mechanical backup. Crafted from aviation-grade aluminium, it relies entirely on your breath—meaning it will never run out of battery or fail in harsh weather. We often recommend carrying both for complete peace of mind.',
    keywords: ['alarm vs whistle', 'difference', 'compare alarm', 'siren vs whistle', 'both', 'instead', 'acoustic', 'backup'],
    followUps: ['choose-kit', 'alarm-how', 'whistle-how', 'care-battery'],
    links: [
      { label: 'Personal SOS Alarm', href: '/products/sos-alarm' },
      { label: 'Survival Whistle', href: '/products/whistle' },
    ],
  },
  {
    id: 'choose-kit',
    category: 'choose',
    question: 'Should I buy more than one tool to build a safety kit?',
    answer:
      'Yes, building a layered safety kit is a very practical approach. A popular setup is keeping the SOS Alarm on your main keys and attaching the Survival Whistle to the bag you use most often. This ensures you always have a tool within reach, even if a battery dies or you switch bags.\n\nAdd pepper spray to your kit only if you commit to carrying it in a highly accessible spot (like a jacket pocket). Add the window breaker if you regularly commute by car.\n\nOrders over ₹1,499 ship for free across India, making it easy to bundle tools for yourself or your family.',
    keywords: ['kit', 'bundle', 'combo', 'together', 'more than one', 'pair', 'set', 'collection', 'all four', 'gift', 'layered safety'],
    followUps: ['orders-shipping', 'choose-which', 'window-where'],
    links: [{ label: 'Shop the collection', href: '/products' }],
  },
  {
    id: 'choose-student',
    category: 'choose',
    question: 'What is the best safety tool for college students?',
    answer:
      'For campus life, late-night library sessions, and hostel living, the Personal SOS Alarm is essential. It requires no apps or phone connectivity, meaning it works perfectly even if a phone battery dies after a long day of classes.\n\nWe also suggest clipping the Survival Whistle to a backpack for a silent, ultra-lightweight backup. If you are considering pepper spray, please check your specific university or hostel guidelines first, as campus rules vary. \n\nWe also offer comprehensive safety orientation workshops for universities to help students build confidence.',
    keywords: ['student', 'campus', 'college', 'hostel', 'university', 'library', 'late class', 'daughter', 'son', 'teen', 'first year', 'youth'],
    followUps: ['alarm-how', 'whistle-how', 'legal-pepper', 'partnerships-campus'],
    links: [
      { label: 'SOS Alarm', href: '/products/sos-alarm' },
      { label: 'Campus programmes', href: '/institutions' },
    ],
  },
  {
    id: 'choose-commute',
    category: 'choose',
    question: 'Which tools are best for evening commutes or night travel?',
    answer:
      'If your routine involves walking through poorly lit areas, waiting for a late local train, or navigating isolated parking lots, the Personal SOS Alarm is your best starting point. Keep it clipped where you can pull the pin instantly without digging through your bag. The 130dB siren is designed to startle and draw immediate public attention.\n\nPepper spray is a strong secondary option, but it is only effective if carried in your hand or an outer pocket during the most vulnerable parts of your commute. If buried in a tote bag, it cannot help you quickly.',
    keywords: ['commute', 'metro', 'local', 'bus', 'walk', 'evening', 'night', 'parking', 'office', 'late', 'night travel', 'safe travel'],
    followUps: ['alarm-does-it-stop', 'pepper-how', 'choose-kit'],
    links: [{ label: 'Personal SOS Alarm', href: '/products/sos-alarm' }],
  },
  {
    id: 'choose-driver',
    category: 'choose',
    question: 'What emergency tools should I keep in my car?',
    answer:
      'Every vehicle should have the Emergency Window Breaker. Weighing just 92 grams, it features a spring-loaded tungsten point to shatter tempered side glass and a concealed stainless steel blade to cut jammed seatbelts instantly.\n\nKeep it in the centre console or door pocket—somewhere you can easily reach while strapped into your seat. Please note: it is designed for tempered side windows and will not shatter a laminated front windscreen. This is a dedicated transit tool and should not be carried on your daily keyring.',
    keywords: ['car', 'drive', 'driving', 'vehicle', 'cab', 'taxi', 'road trip', 'glovebox', 'accident', 'crash', 'seatbelt', 'emergency escape'],
    followUps: ['window-how', 'window-glass', 'legal-flight'],
    links: [{ label: 'Emergency Window Breaker', href: '/products/windowbreaker' }],
  },
  {
    id: 'choose-prices',
    category: 'choose',
    featured: true,
    question: 'How much do Whaleora safety products cost?',
    answer:
      'We believe reliable safety tools should be accessible. Our collection ranges from ₹299 to ₹1,799, with all taxes included.\n\n• Survival Whistle: ₹299\n• Pepper Spray: ₹499\n• Emergency Window Breaker: ₹599\n• Personal SOS Alarm: ₹1,799\n\nThere are no hidden fees, no required apps, and no monthly subscriptions. We also offer free shipping across India on all orders over ₹1,499.',
    keywords: ['price', 'cost', 'how much', '₹', 'rupee', 'expensive', 'cheap', 'afford', '299', '499', '599', '1699', 'subscription', 'value'],
    followUps: ['choose-cheap-alarm', 'orders-shipping', 'choose-which'],
    links: [{ label: 'See all four', href: '/products' }],
  },
  {
    id: 'choose-cheap-alarm',
    category: 'choose',
    question: 'Why choose Whaleora over a cheaper alarm online?',
    answer:
      'Your peace of mind shouldn’t rely on a compromised product. Many unbranded alarms claim to be 130dB but fail to deliver when tested. \n\nWe provide exact, honest specifications you can trust: a verified 130dB output, a lightweight 28g impact-resistant polymer body, and a reliable rechargeable Lithium-Ion battery. We prioritize build quality and rigorous testing so you know your tool will work the moment you pull the pin. If you ever experience a defect, our support team is easily reachable to make it right.',
    keywords: ['cheap', 'amazon', 'flipkart', '99', 'duplicate', 'fake', 'why whaleora', 'quality', 'rated', 'trust', 'reliable'],
    followUps: ['alarm-loud', 'orders-faulty', 'choose-prices'],
    links: [{ label: 'SOS Alarm specs', href: '/products/sos-alarm' }],
  },
  {
    id: 'alarm-how',
    category: 'alarm',
    featured: true,
    question: 'How do you use the Personal SOS Alarm?',
    answer:
      'It is designed to be intuitive under stress. It takes just three seconds to learn:\n\n1. Carry: Clip it to your keyring, lanyard, or bag strap so it is always within reach.\n2. Pull: Firmly yank the top pin. A piercing 130dB dual-siren and flashing strobe light will activate instantly.\n3. Reset: Push the pin back into the device to silence the alarm.\n\nThere are no apps to pair, no buttons to fumble with, and no complex settings. Simply pull to activate.',
    keywords: ['how it works', 'how to use', 'pull pin', 'activate', 'reset', 'siren', 'strobe', 'instructions', 'operate', 'sos alarm', 'guide'],
    followUps: ['alarm-loud', 'care-battery', 'alarm-does-it-stop'],
    links: [{ label: 'Personal SOS Alarm', href: '/products/sos-alarm' }],
  },
  {
    id: 'alarm-loud',
    category: 'alarm',
    featured: true,
    question: 'How loud is the 130dB SOS alarm?',
    answer:
      'It is exceptionally loud—designed specifically to disrupt a situation and draw immediate attention. For reference, 130dB is equivalent to standing near a professional sporting event crowd or holding a standard smoke detector at arm’s length.\n\nThe alarm features a dual-siren to maximize acoustic spread, alongside a bright strobe light to ensure you are highly visible even in the dark.',
    keywords: ['loud', '130', '130db', '120db', 'decibel', 'volume', 'noise', 'sound', 'smoke alarm', 'hear', 'how loud', 'alarm', 'sos'],
    followUps: ['alarm-does-it-stop', 'whistle-how', 'care-test'],
    links: [{ label: 'Personal SOS Alarm', href: '/products/sos-alarm' }],
  },
  {
    id: 'alarm-does-it-stop',
    category: 'alarm',
    question: 'Will a personal alarm physically stop an attacker?',
    answer:
      'A personal alarm is an acoustic deterrent, not a physical weapon. It will not physically restrain someone, but at 130dB, it effectively removes an aggressor’s most critical advantage: privacy and silence.\n\nThe piercing noise is designed to startle, cause discomfort, draw the attention of bystanders, and ultimately buy you vital seconds to escape to safety. If your primary concern is maintaining physical distance, we recommend exploring our pepper spray options alongside the alarm.',
    keywords: ['stop', 'attacker', 'protect', 'defence', 'defense', 'effective', 'work', 'does it help', 'safety', 'weapon', 'deterrent'],
    followUps: ['pepper-how', 'choose-which', 'alarm-how'],
    links: [{ label: 'Read our practical safety advice', href: '/safety-hub' }],
  },
  {
    id: 'alarm-weight',
    category: 'alarm',
    question: 'Is the SOS Alarm heavy or bulky to carry?',
    answer:
      'Not at all. It weighs just 28 grams and is designed in a compact, modern keychain format so it never feels burdensome to carry every day.\n\nYour order includes the alarm, a C-Type charging cable, a user manual, and a durable keychain attachment. The casing is weather-resistant, meaning it can easily handle daily commutes and rain, though it should not be fully submerged in water.',
    keywords: ['weight', 'size', 'heavy', 'how heavy', 'how big', '28g', '28 grams', 'small', 'keyring', 'keychain', 'compact', 'dimensions', 'weather-resistant', 'waterproof', 'rain'],
    followUps: ['care-battery', 'alarm-how', 'choose-kit'],
    links: [{ label: 'Personal SOS Alarm', href: '/products/sos-alarm' }],
  },
  {
    id: 'alarm-app',
    category: 'alarm',
    question: 'Does the alarm require an app, Bluetooth, or a subscription?',
    answer:
      'Absolutely not. During an emergency, anything you have to unlock, pair, or log into is a dangerous delay. \n\nThe Whaleora SOS Alarm operates entirely independently. There is no smartphone app, no Bluetooth pairing required, and zero subscription fees. You simply pull the pin to activate it.',
    keywords: ['app', 'bluetooth', 'wifi', 'pair', 'phone', 'smartphone', 'mobile', 'android', 'iphone', 'gps', 'location', 'subscription', 'charge', 'usb', 'smart'],
    followUps: ['care-battery', 'alarm-how', 'choose-cheap-alarm'],
  },
  {
    id: 'pepper-legal',
    category: 'pepper',
    featured: true,
    question: 'Is it legal to carry pepper spray for self-defense in India?',
    answer:
      'Yes, it is legally permissible to carry pepper spray for self-defense purposes across most of India. However, specific entry rules can vary depending on where you are. Commercial airlines, government buildings, courts, and certain university campuses often strictly prohibit chemical sprays on their premises.\n\nWe always advise checking local venue guidelines before you travel. If you are heading somewhere with strict security, leave the spray at home and carry your SOS Alarm or Whistle instead.',
    keywords: ['legal', 'law', 'india', 'allowed', 'permit', 'licence', 'license', 'illegal', 'police', 'state', 'carry pepper', 'oc spray', 'self defense'],
    followUps: ['legal-flight', 'pepper-how', 'choose-which'],
    links: [{ label: 'Pepper Spray', href: '/products/pepperspray' }],
  },
  {
    id: 'pepper-how',
    category: 'pepper',
    question: 'How do you use the pepper spray safely?',
    answer:
      'Our 50ml Oleoresin Capsicum (OC) canister is designed for intuitive, one-handed use under stress. It features a secure locking cap to prevent accidental discharge in your bag and offers a safe deployment range of 8 to 10 feet.\n\nTo use it: carry it in an accessible outer pocket, flip or twist the safety lock, aim the stream directly at the face, and immediately run toward safety and help. Remember, pepper spray is meant to buy you distance—it is a tool for escape, not engagement.',
    keywords: ['pepper', 'spray', 'oc', 'oleoresin', 'capsicum', '50ml', 'range', 'lock', 'how to spray', 'stream', 'use spray', 'safety lock'],
    followUps: ['pepper-legal', 'pepper-shelf', 'legal-flight'],
    links: [{ label: 'Pepper Spray', href: '/products/pepperspray' }],
  },
  {
    id: 'pepper-shelf',
    category: 'pepper',
    question: 'Does pepper spray expire?',
    answer:
      'Yes, pepper spray typically has a shelf life of up to three years from the date of manufacture. Over time, the pressure inside the aerosol canister can decrease, and extreme heat can degrade the formula.\n\nWe recommend noting your purchase date and storing the canister away from direct sunlight (do not leave it in a hot car). Once expired, please check your local municipal guidelines for aerosol disposal to ensure environmental safety.',
    keywords: ['expiry', 'expire', 'shelf', '3 years', 'old', 'replace spray', 'heat', 'store pepper', 'disposal'],
    followUps: ['care-storage', 'pepper-how', 'orders-faulty'],
  },
  {
    id: 'whistle-how',
    category: 'whistle',
    question: 'Why carry a survival whistle?',
    answer:
      'A whistle is the ultimate fail-safe. Made from 12 grams of aviation-grade aluminium, our dual-tube Survival Whistle requires no batteries, electronics, or maintenance. \n\nA single firm breath produces a sharp 120dB sound that cuts through ambient noise. It easily clips to a zipper or keyring, making it an excellent primary tool for minimalists, or the perfect backup to ensure you always have a way to signal for help.',
    keywords: ['whistle', '120db', 'aluminium', 'aluminum', 'dual tube', 'breath', 'blow', '12g', 'zipper', 'signal', 'fail-safe'],
    followUps: ['choose-alarm-vs-whistle', 'legal-flight', 'choose-student'],
    links: [{ label: 'Survival Whistle', href: '/products/whistle' }],
  },
  {
    id: 'whistle-kids',
    category: 'whistle',
    question: 'Are Whaleora safety tools appropriate for children?',
    answer:
      'The Survival Whistle is highly appropriate for children when attached to a school bag or jacket zipper. We recommend having a calm conversation with them about using it only as a signalling tool if they become lost, hurt, or separated from you.\n\nWhile the SOS Alarm is excellent for older teenagers and college students, the whistle is simpler for young children to operate. None of our products should be treated as toys.',
    keywords: ['child', 'kid', 'children', 'school', 'daughter', 'son', 'family', 'age', 'kids', 'youth safety'],
    followUps: ['whistle-how', 'choose-student', 'brand-hub'],
    links: [{ label: 'Family safety guides', href: '/safety-hub' }],
  },
  {
    id: 'window-how',
    category: 'window',
    question: 'How do you use the car window breaker and seatbelt cutter?',
    answer:
      'This 92-gram tool is engineered for rapid extraction during transit emergencies. \n\nIf a seatbelt mechanism jams after a collision, pull the fabric taut and slice through it using the concealed stainless steel blade. If the vehicle doors will not open, firmly press the spring-loaded tungsten steel point against the corner of the side window to shatter the glass.\n\nBecause it relies on a mechanical spring rather than a hammer strike, it works perfectly even underwater.',
    keywords: ['window breaker', 'glass breaker', 'tungsten', 'spring', 'strike', 'cutter', 'seatbelt cutter', 'escape', 'how to break', 'underwater', 'car crash'],
    followUps: ['window-glass', 'window-where', 'legal-flight'],
    links: [{ label: 'Emergency Window Breaker', href: '/products/windowbreaker' }],
  },
  {
    id: 'window-glass',
    category: 'window',
    question: 'Will the window breaker shatter a car windshield?',
    answer:
      'No. The tool is specifically designed to shatter tempered glass, which is used for the side and rear windows of a car. \n\nFront windshields are made of laminated glass (two layers of glass with a plastic sheet in between) to prevent them from shattering into the cabin. In an emergency, do not waste time on the windshield—always target the lower corners of the side windows to escape quickly.',
    keywords: ['windscreen', 'windshield', 'laminated', 'tempered', 'side glass', 'rear', 'shatter', 'won’t break', 'which window', 'escape'],
    followUps: ['window-how', 'window-where', 'choose-driver'],
  },
  {
    id: 'window-where',
    category: 'window',
    question: 'Where is the best place to keep the window breaker in my car?',
    answer:
      'Store it in your centre console, glovebox, or driver-side door pocket. The rule of thumb is: keep it where you can easily grab it while your seatbelt is fastened.\n\nDo not attach it to your main car keys. If the ignition is engaged or the keys fly away during an impact, the tool will be out of reach when you need it most.',
    keywords: ['where to keep', 'glovebox', 'door pocket', 'keyring', 'store breaker', 'car kit', 'console'],
    followUps: ['window-how', 'legal-flight', 'choose-driver'],
  },
  {
    id: 'orders-shipping',
    category: 'orders',
    featured: true,
    question: 'Do you offer free shipping across India?',
    answer:
      'Yes, we provide free shipping on all orders over ₹1,499 anywhere in India. For orders below that amount, a standard shipping fee will be calculated at checkout based on your specific pincode.\n\nWe carefully package and dispatch all orders from our facility in Maharashtra. Accurate delivery estimates are provided directly at checkout so you know exactly when to expect your safety tools.',
    keywords: ['shipping', 'delivery', 'deliver', 'free shipping', '1499', 'pincode', 'india', 'dispatch', 'how long', 'how long does delivery', 'days', 'courier', 'maharashtra'],
    followUps: ['orders-track', 'orders-payment', 'choose-prices'],
    links: [{ label: 'Shop the collection', href: '/products' }],
  },
  {
    id: 'orders-track',
    category: 'orders',
    question: 'How do I track my delivery or change my shipping address?',
    answer:
      'Once your order ships, you will receive an email confirmation containing your courier tracking link. \n\nIf you need to change your address before dispatch, or if a package appears delayed, the fastest way to reach us is via WhatsApp. Just send us a message with your name and order number, and our support team will handle it immediately. You can also email us at hello@whaleora.com.',
    keywords: ['track', 'tracking', 'order status', 'where is', 'package', 'parcel', 'change address', 'cancel', 'missing', 'delay'],
    followUps: ['orders-faulty', 'orders-returns', 'orders-contact'],
    links: [
      { label: 'WhatsApp Support', href: whatsappHref('Hi Whaleora! I have a question about my order.') },
      { label: 'Email hello@whaleora.com', href: 'mailto:hello@whaleora.com' },
    ],
  },
  {
    id: 'orders-payment',
    category: 'orders',
    question: 'What payment methods do you accept?',
    answer:
      'We use a secure Shopify checkout that accepts all major Indian payment methods, including Credit/Debit cards, UPI (GPay, PhonePe, etc.), and Net Banking. All listed product prices are inclusive of taxes.\n\nIf you encounter any issues during the checkout process, simply message us on WhatsApp and our team will gladly assist you in placing the order directly.',
    keywords: ['payment', 'pay', 'upi', 'card', 'cod', 'cash on delivery', 'gpay', 'phonepe', 'emi', 'gst', 'invoice', 'bill', 'secure'],
    followUps: ['orders-shipping', 'orders-contact', 'choose-prices'],
    links: [{ label: 'WhatsApp to order', href: whatsappHref("Hi Whaleora! I'd like to place an order.") }],
  },
  {
    id: 'orders-faulty',
    category: 'orders',
    featured: true,
    question: 'What happens if my item arrives damaged or faulty?',
    answer:
      'We stand firmly behind the quality of our tools. If a product arrives damaged or stops functioning correctly, email us at hello@whaleora.com with your order number and a brief description (or photo) of the issue.\n\nWe will replace the unit swiftly. You do not have to fight through automated bots or complex claims processes—a real person will take care of you. Please contact us before mailing anything back so we can provide the correct return address.',
    keywords: ['faulty', 'broken', 'defective', 'doesn’t work', 'not working', 'arrives broken', 'arrived broken', 'replace', 'warranty', 'damaged', 'wrong item', 'guarantee'],
    followUps: ['orders-returns', 'orders-contact', 'care-test'],
    links: [
      { label: 'Warranty & claims', href: '/warranty' },
      { label: 'Email support', href: 'mailto:hello@whaleora.com?subject=Faulty%20item' },
      { label: 'WhatsApp', href: whatsappHref('Hi Whaleora! Something arrived faulty.') },
    ],
  },
  {
    id: 'orders-returns',
    category: 'orders',
    question: 'What is your return and refund policy?',
    answer:
      'We offer a 7-day return window from the date of delivery. If you change your mind, or if an item is incorrect or damaged, email hello@whaleora.com to initiate the return.\n\nIf the error is ours (e.g., faulty or wrong item), we cover all return shipping costs. For standard changes of mind, return shipping is deducted from the refund. Please note: for safety and hygiene reasons, tools must be returned in an unused, checkable condition (e.g., pepper spray safety seals must be intact). Refunds are processed within 7 business days of approval.',
    keywords: ['return', 'refund', 'exchange', 'send back', 'policy', 'unused', 'change of mind', '7 days', 'return window', 'money back'],
    followUps: ['orders-faulty', 'orders-contact', 'pepper-how'],
    links: [{ label: 'Contact support', href: '/contact' }],
  },
  {
    id: 'orders-contact',
    category: 'orders',
    question: 'How can I contact Whaleora customer support?',
    answer:
      'We believe in real human support. For quick questions, order tracking, or product advice, WhatsApp is the fastest channel. \n\nFor institutional partnerships, bulk orders, or detailed support claims, please email us at hello@whaleora.com. Our team operates out of Sambhaji Nagar, Thane, Maharashtra, and we read and reply to every message personally.',
    keywords: ['contact', 'whatsapp', 'email', 'phone', 'human', 'support', 'hello', 'thane', 'address', 'talk to', 'call', 'customer service'],
    followUps: ['partnerships-how', 'orders-faulty', 'brand-where'],
    links: [
      { label: 'WhatsApp', href: whatsappHref('Hi Whaleora! I have an inquiry.') },
      { label: 'hello@whaleora.com', href: 'mailto:hello@whaleora.com' },
      { label: 'Contact page', href: '/contact' },
    ],
  },
  {
    id: 'legal-flight',
    category: 'legal',
    featured: true,
    question: 'Are personal safety tools allowed on airplanes?',
    answer:
      'The Survival Whistle is completely safe to fly with as it is simply a solid piece of aluminium. \n\nHowever, pepper spray is strictly prohibited on almost all commercial airlines, both in cabin and checked luggage. The window breaker contains a concealed blade and cannot be taken in cabin baggage. The SOS Alarm contains a battery and is generally allowed in cabin bags, but regulations change frequently. When in doubt, leave the spray and breaker at home and travel with the alarm and whistle.',
    keywords: ['flight', 'fly', 'flying', 'plane', 'airline', 'airport', 'cabin', 'checked bag', 'travel', 'tsa', 'security', 'aeroplane', 'airplane', 'carry on', 'allowed'],
    followUps: ['pepper-legal', 'window-where', 'whistle-how'],
    links: [{ label: 'Survival Whistle', href: '/products/whistle' }],
  },
  {
    id: 'legal-venues',
    category: 'legal',
    question: 'Can I carry these tools into concerts, stadiums, or government buildings?',
    answer:
      'Acoustic deterrents like the SOS Alarm and Survival Whistle are rarely restricted and are generally safe to carry into most public venues. \n\nConversely, venues with tight security checkpoints (concerts, courts, metro stations) will often confiscate pepper spray or tools with blades, like our window breaker. Always check the specific bag policy of your destination beforehand to avoid having your tools confiscated at the door.',
    keywords: ['college', 'court', 'concert', 'stadium', 'metro security', 'bag check', 'venue', 'restricted', 'hostel rules', 'event'],
    followUps: ['pepper-legal', 'legal-flight', 'choose-student'],
  },
  {
    id: 'care-battery',
    category: 'care',
    featured: true,
    question: 'How do I charge the SOS Alarm, and how long does the battery last?',
    answer:
      'The Personal SOS Alarm features a modern, rechargeable Lithium-Ion battery. It comes with a C-Type USB cable in the box for easy charging. When fully charged, the battery will hold its power for up to a month on standby.\n\nBecause batteries can eventually drain, we always suggest pairing your alarm with the mechanical Survival Whistle so you are never left without a way to call for help.',
    keywords: ['battery', 'charge', 'charging', 'Lithium Ion', 'coin cell', 'dies', 'dead', 'replace battery', 'usb', 'power', 'standby', 'how long'],
    followUps: ['care-test', 'choose-alarm-vs-whistle', 'alarm-how'],
    links: [{ label: 'Personal SOS Alarm', href: '/products/sos-alarm' }],
  },
  {
    id: 'care-test',
    category: 'care',
    question: 'Should I test my SOS Alarm when it arrives?',
    answer:
      'Absolutely. Familiarity builds confidence. We recommend testing the alarm outdoors or after warning anyone nearby.\n\nSimply pull the pin for a second or two to confirm the 130dB siren and strobe are fully operational, then push the pin back in to silence it. This quick test ensures you know exactly how much force is required to pull the pin under stress. Just be sure not to test it in quiet public spaces.',
    keywords: ['test', 'try', 'practice', 'demo', 'false alarm', 'accidental', 'check it works', 'maintenance'],
    followUps: ['care-battery', 'alarm-how', 'care-storage'],
  },
  {
    id: 'care-storage',
    category: 'care',
    question: 'How should I properly store and maintain my safety tools?',
    answer:
      'Safety tools only work if they are accessible. Keep your SOS Alarm and Whistle clipped to the bag or keys you use daily. \n\nFor maintenance, make it a habit to glance at your gear once a month: check that the alarm pin is seated firmly, clear any pocket lint out of the whistle tubes, and ensure your pepper spray is not stored in direct sunlight or a baking hot car. A tool locked away in a drawer cannot protect you when you are out.',
    keywords: ['store', 'storage', 'heat', 'sun', 'drawer', 'dashboard', 'maintain', 'care', 'clean', 'upkeep'],
    followUps: ['pepper-shelf', 'window-where', 'care-test'],
  },
  {
    id: 'partnerships-how',
    category: 'partnerships',
    question: 'Does Whaleora conduct safety workshops for universities or corporate offices?',
    answer:
      'Yes, education is a core part of our mission. We regularly partner with universities, NGOs, and corporate workplaces to conduct empowering, practical safety awareness sessions.\n\nOur approach is highly customized: we assess the specific daily routines of your group (e.g., night shift workers vs. college freshmen), deliver an engaging session, and provide long-term resources and specialized product kits. To start a conversation, simply WhatsApp or email us with your group size and goals.',
    keywords: ['workshop', 'campus', 'university', 'corporate', 'office', 'training', 'session', 'partnership', 'bulk', 'wholesale', 'ngo', 'institution', 'college programme', 'b2b'],
    followUps: ['partnerships-retail', 'choose-student', 'orders-contact'],
    links: [
      { label: 'Corporate & Campus Partnerships', href: '/institutions' },
      { label: 'WhatsApp our team', href: whatsappHref('Hi Whaleora! I would like to explore institutional partnerships.') },
    ],
  },
  {
    id: 'partnerships-retail',
    category: 'partnerships',
    question: 'Can I become a retail stockist for Whaleora products?',
    answer:
      'We welcome partnerships with retail spaces that share our commitment to education and customer care. We look for stockists who are willing to talk customers through their options to find the tool that actually fits their routine.\n\nIf you believe Whaleora is a good fit for your store, please email hello@whaleora.com with the subject line “Partnership enquiry” or reach out via WhatsApp. Include your location and a brief overview of your current retail setup.',
    keywords: ['retail', 'stockist', 'wholesale', 'distributor', 'shop', 'store', 'resell', 'dealer', 'b2b sales'],
    followUps: ['partnerships-how', 'orders-contact', 'choose-prices'],
    links: [{ label: 'Start a partnership enquiry', href: 'mailto:hello@whaleora.com?subject=Partnership%20enquiry' }],
  },
  {
    id: 'brand-what',
    category: 'brand',
    question: 'What is the story behind Whaleora?',
    answer:
      'Whaleora was founded in Mumbai by Sheuli, who noticed a frustrating gap in the personal safety market. The available options were either intimidating, militaristic tactical gear, or flimsy novelty keychains that failed to work when needed.\n\nWe built Whaleora to provide high-quality, reliable safety essentials—like our 130dB SOS Alarm and aerospace-grade Whistle—designed for everyday people. Our ethos is "Your Safety. Our Priority." We focus on practical preparedness, not fear-mongering, which is why we also provide extensive free educational resources through our Safety Hub.',
    keywords: ['whaleora', 'about', 'brand', 'what is', 'company', 'mission', 'story', 'why start', 'history', 'values'],
    followUps: ['brand-where', 'brand-hub', 'choose-which'],
    links: [
      { label: 'Read our full story', href: '/about' },
      { label: 'Shop essentials', href: '/products' },
    ],
  },
  {
    id: 'brand-where',
    category: 'brand',
    question: 'Where is Whaleora based?',
    answer:
      'We are proudly based out of Sambhaji Nagar, Thane, Maharashtra. All our products are designed with the realities of Indian commutes and campuses in mind, and we ship securely across the entire country.\n\nYou can follow our community initiatives on Instagram at @whaleora.safety, or reach out to our local team anytime at hello@whaleora.com.',
    keywords: ['where', 'based', 'located', 'thane', 'mumbai', 'maharashtra', 'india', 'address', 'founded', 'sheuli', 'founder', 'instagram', 'social media'],
    followUps: ['brand-what', 'orders-contact', 'brand-hub'],
    links: [
      { label: 'About Whaleora', href: '/about' },
      { label: 'Instagram', href: 'https://www.instagram.com/whaleora.safety' },
    ],
  },
  {
    id: 'brand-hub',
    category: 'brand',
    question: 'Does Whaleora offer free safety advice or guides?',
    answer:
      'Yes, education is just as important as the tools themselves. We created the Whaleora Safety Hub to provide free, practical guidance for everyday situations—from safe solo travel and night commutes to campus living and family preparedness.\n\nOur guides are completely free to read, require no email signups, and are designed to be calm, actionable, and reassuring. We also provide a free printable emergency contact card to keep in your wallet.',
    keywords: ['guide', 'hub', 'checklist', 'blog', 'article', 'emergency card', 'free', 'tips', 'advice', 'education', 'learn'],
    followUps: ['choose-student', 'partnerships-how', 'brand-what'],
    links: [
      { label: 'Explore the Safety Hub', href: '/safety-hub' },
      { label: 'Print your Emergency contact card', href: '/safety-hub#emergency-card' },
    ],
  },
];

export const faqById = new Map(faqs.map((entry) => [entry.id, entry]));

export const faqsByCategory = (category: FaqCategory) => faqs.filter((entry) => entry.category === category);

export const featuredFaqs = faqs.filter((entry) => entry.featured);

export const greetingText =
  'Ask about a product, a flight, battery care, campus sessions, or a recent order. I’ll provide honest answers based on the tools we actually build—and I’ll always let you know when it’s best to speak with a real person on our team.';