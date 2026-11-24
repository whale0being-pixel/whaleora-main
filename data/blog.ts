import type { BlogPost } from '@/lib/content/types';

/**
 * Starter posts for the journal. They seed the studio the first time it loads
 * without any saved posts; after that, the admin content is the only source.
 */
export const starterPosts: BlogPost[] = [
  {
    id: 'post-ten-minute-plan',
    slug: 'the-ten-minute-safety-plan',
    title: 'The ten-minute safety plan',
    excerpt: 'Most of being prepared is deciding a few things once, in advance, so you are not deciding them under pressure.',
    category: 'Everyday Safety',
    author: 'Whaleora Team',
    date: '2026-09-01',
    coverImage: '/stock/journey-city.webp',
    body: `Personal safety is rarely about living on alert. Nobody can sustain that, and it makes ordinary days worse. What actually helps is making a handful of decisions once, calmly, so they are already made when it matters.

## Pick two people

Choose two contacts who will pick up at odd hours, and tell them they are on your list. Save them as favourites so they are one tap away, and write their numbers down somewhere that is not your phone.

## Decide where things live

Keys, phone, alarm, cards. If each has one pocket, you can find them without looking and notice when one is missing.

- Keys and alarm on the same ring
- Phone in the pocket you can reach with either hand
- A little cash separate from your wallet

## Know your route home

Have a default way back from the places you go most, and a second option for when the first one feels wrong. You do not need a reason to switch.

That is the whole plan. Ten minutes once, and a quick check whenever your routine changes.`,
    visible: true,
  },
  {
    id: 'post-late-commute',
    slug: 'a-calmer-late-commute',
    title: 'A calmer late commute',
    excerpt: 'Small, practical habits for the days that run later than planned — on trains, in cabs and on the walk home.',
    category: 'Commute',
    author: 'Whaleora Team',
    date: '2026-09-15',
    coverImage: '/stock/journey-train.webp',
    body: `Late evenings are when most of us are tired, distracted and in a hurry to get home. A few habits take the guesswork out of the journey.

## Before you leave

Charge your phone above 30 percent if you can, and share your trip or live location with someone you trust. Check the last train or bus time rather than assuming it.

## On the way

Sit near the driver or in a busier carriage. Keep one ear free if you are listening to something. If a cab's number plate does not match the app, do not get in — cancel and rebook.

- Confirm the driver's name before you say yours
- Sit behind the passenger seat
- Keep your bag on your lap, not the seat beside you

## The last stretch

Have your keys in hand before you reach your door, and let your contact know you are home. It is a small message, and it closes the loop.`,
    visible: true,
  }
  ,{
    "id": "post-sos-alarm-vs-whistle",
    "slug": "personal-safety-alarm-vs-safety-whistle",
    "title": "Personal safety alarm vs safety whistle: which should you carry?",
    "excerpt": "Both can attract attention, but a battery-powered alarm and a breath-powered whistle work differently. Compare when each makes sense.",
    "category": "Product Comparisons",
    "author": "Whaleora Team",
    "date": "2026-11-24",
    "coverImage": "",
    "visible": true,
    "body": "A personal safety alarm and a safety whistle have a similar purpose: making noise so people nearby can notice that you need help. They are not interchangeable, though. One is activated by a pull pin and battery; the other depends on your breath.\n\n## Personal SOS Alarm\n\nWhaleora’s Personal SOS Alarm is specified at 130dB. Pulling its pin activates the alarm and flashing LED. The AF-2004 supplier specification lists a 130mAh Type-C rechargeable lithium battery, about 90 minutes to charge and about 70 minutes of alarm duration. It is useful when you want an alarm that activates with one pull without needing to blow into a whistle.\n\n## Safety whistle\n\nThe Whaleora Survival Whistle is a 120dB dual-tube, breath-powered whistle. It does not need a battery or charging. It is a simple mechanical option, but you need to be able to reach it and blow it.\n\n## Which one should you choose?\n\n- Choose the alarm if one-pull activation and a flashing light are useful for your routine.\n- Choose the whistle if you prefer a battery-free tool that works through your breath.\n- Consider carrying both if you want a powered alarm and a separate mechanical option, and can keep each accessible.\n\nNeither product guarantees protection or replaces moving towards safety, contacting emergency services or following local safety guidance.\n\n## See the product details\n\nCompare the [Personal SOS Alarm](/products/sos-alarm) and [Survival Whistle](/products/whistle) specifications before choosing."
  },
  {
    "id": "post-pepper-spray-vs-alarm",
    "slug": "pepper-spray-vs-personal-safety-alarm",
    "title": "Pepper spray vs personal safety alarm: understand the difference",
    "excerpt": "One is a distance tool with handling and legal considerations; the other is an attention-drawing alarm. Here is how to think about the choice.",
    "category": "Product Comparisons",
    "author": "Whaleora Team",
    "date": "2026-11-24",
    "coverImage": "",
    "visible": true,
    "body": "Pepper spray and a personal safety alarm serve different purposes. The right choice depends on what you are comfortable carrying, how you can access it, and the rules that apply where you live or travel.\n\n## Personal safety alarm\n\nThe Whaleora Personal SOS Alarm is a 130dB pull-pin alarm with a flashing LED. It is designed to attract attention. It does not physically stop a person or create distance by itself.\n\n## Pepper spray\n\nWhaleora Pepper Spray is an OC canister with a stated range of up to 7 feet. It requires the user to access, unlock and operate the canister correctly. Wind, enclosed spaces, handling and local rules are important considerations. It is intended as an option for creating distance to escape, not for confrontation.\n\n## How to decide\n\n- Consider an alarm if you want a one-pull attention signal.\n- Consider pepper spray only if you understand safe handling, can carry it accessibly and have checked applicable laws and venue rules.\n- Do not rely on either tool as a substitute for route planning, emergency contacts or seeking help.\n\n## Explore the products\n\nRead the [SOS Alarm details](/products/sos-alarm) and [Pepper Spray details](/products/pepperspray), including their instructions and limitations."
  },
  {
    "id": "post-window-breaker-vs-alarm",
    "slug": "car-window-breaker-vs-personal-safety-alarm",
    "title": "Car window breaker vs personal safety alarm: two tools for different situations",
    "excerpt": "A vehicle escape tool and a personal alert device solve different problems. Understand where each belongs and what it cannot do.",
    "category": "Product Comparisons",
    "author": "Whaleora Team",
    "date": "2026-11-24",
    "coverImage": "",
    "visible": true,
    "body": "A car emergency tool and an everyday personal alarm should not be compared as if they do the same job. One is intended for a vehicle escape scenario; the other is intended to attract attention.\n\n## Emergency Window Breaker\n\nWhaleora’s Emergency Window Breaker weighs 92g and combines a spring-loaded strike point for suitable tempered automotive side glass with a concealed seatbelt cutter. It is designed to be stored somewhere reachable from the driver's or passenger's seat, such as a suitable door pocket or console. It is not designed to break laminated windscreens.\n\n## Personal SOS Alarm\n\nThe Personal SOS Alarm is a 130dB pull-pin alarm with a flashing LED. It is a carryable alert device, not a glass-breaking or seatbelt-cutting tool.\n\n## Which one belongs where?\n\n- Keep a window breaker secured and accessible inside the vehicle, not on a keyring.\n- Carry the SOS Alarm where it can be reached quickly during everyday travel.\n- If you drive regularly, the two tools address different scenarios and are not substitutes for each other.\n\n## Read the product details\n\nSee the [Emergency Window Breaker](/products/windowbreaker) and [Personal SOS Alarm](/products/sos-alarm) pages for specifications and use guidance."
  },
  {
    "id": "post-pepper-vs-whistle",
    "slug": "pepper-spray-vs-safety-whistle",
    "title": "Pepper spray vs safety whistle: active use or a simple signal?",
    "excerpt": "Understand the difference between a personal safety spray and a breath-powered whistle before deciding what fits your needs.",
    "category": "Product Comparisons",
    "author": "Whaleora Team",
    "date": "2026-11-24",
    "coverImage": "",
    "visible": true,
    "body": "Pepper spray and a whistle are very different personal safety tools. One is an OC spray canister that requires careful handling; the other is a simple acoustic signal powered by your breath.\n\n## Pepper spray\n\nWhaleora Pepper Spray is an OC canister with a stated range of up to 7 feet. Users need to understand the safety lock, storage and operating instructions, and check applicable laws and venue rules before carrying it. It is intended to help create distance to escape, not to encourage confrontation.\n\n## Safety whistle\n\nThe Whaleora Survival Whistle is a 120dB dual-tube, breath-powered device. It requires no battery or charging. It can signal for attention, but it does not create physical distance.\n\n## Choosing between them\n\nChoose based on the function you need and the tool you can carry and operate responsibly. Some people may prefer a whistle as a simple signal; others may consider pepper spray after reviewing the handling requirements and local rules. They are not direct substitutes.\n\nExplore the [Pepper Spray](/products/pepperspray) and [Survival Whistle](/products/whistle) product information."
  },
  {
    "id": "post-window-breaker-vs-whistle",
    "slug": "car-window-breaker-vs-safety-whistle",
    "title": "Car window breaker vs safety whistle: vehicle preparedness or everyday carry?",
    "excerpt": "These tools are designed for entirely different situations. Learn why vehicle storage and everyday carry should be treated separately.",
    "category": "Product Comparisons",
    "author": "Whaleora Team",
    "date": "2026-11-24",
    "coverImage": "",
    "visible": true,
    "body": "A window breaker and a safety whistle solve different problems. One is a vehicle escape tool; the other is a battery-free way to make an audible signal.\n\n## Window breaker for vehicle emergencies\n\nWhaleora’s Emergency Window Breaker weighs 92g and combines a spring-loaded strike point for suitable tempered automotive side glass with a concealed seatbelt cutter. It should be secured in a location that can be reached from inside the vehicle. It is not designed to break a laminated windscreen.\n\n## Whistle for everyday carry\n\nThe Whaleora Survival Whistle is a 120dB dual-tube whistle powered by your breath. It needs no battery and can be attached to a bag or carried as an everyday signal tool.\n\n## A practical distinction\n\nA whistle is not a replacement for a vehicle escape tool. A window breaker is not an everyday alert device. Choose based on the scenario, and keep each tool in the place where it is meant to be used.\n\nSee the [Window Breaker](/products/windowbreaker) and [Survival Whistle](/products/whistle) product pages."
  },
  {
    "id": "post-pepper-vs-window-breaker",
    "slug": "pepper-spray-vs-car-window-breaker",
    "title": "Pepper spray vs car window breaker: personal carry or vehicle emergency?",
    "excerpt": "A personal safety spray and a vehicle escape tool have different jobs, storage needs and limitations.",
    "category": "Product Comparisons",
    "author": "Whaleora Team",
    "date": "2026-11-24",
    "coverImage": "",
    "visible": true,
    "body": "Pepper spray and a car window breaker are not alternatives for the same situation. One is a personal carry product that requires careful handling; the other is designed for a specific vehicle emergency.\n\n## Pepper spray\n\nWhaleora Pepper Spray is an OC canister with a stated range of up to 7 feet. It should be carried accessibly, stored according to its instructions and used only with an understanding of applicable laws and venue restrictions.\n\n## Emergency Window Breaker\n\nWhaleora’s 92g Emergency Window Breaker combines a spring-loaded strike point for suitable tempered automotive side glass with a concealed seatbelt cutter. It should be secured somewhere reachable from inside the vehicle. It is not intended for laminated windscreens.\n\n## Which should you choose?\n\nChoose according to the situation you are preparing for. Pepper spray is a personal carry product; the window breaker belongs in a vehicle. Neither replaces emergency services or a broader safety plan.\n\nRead the [Pepper Spray](/products/pepperspray) and [Window Breaker](/products/windowbreaker) product instructions before deciding."
  },
  {
    "id": "post-womens-safety-products-2027",
    "slug": "best-womens-safety-products-2027-buyers-guide",
    "title": "Best women’s safety products for 2027: a practical buyer’s guide",
    "excerpt": "A useful 2027 guide to choosing personal safety products by purpose, portability, ease of use and real-world limitations — not hype or fear.",
    "category": "Buying Guides",
    "author": "Whaleora Team",
    "date": "2026-11-24",
    "coverImage": "",
    "visible": true,
    "body": "Looking for the best women’s safety products for 2027? Start with the situation you want to prepare for, not a top-ten list. A product is only useful when it is appropriate for the scenario, accessible when needed and something you know how to use.\n\nThis guide compares common categories of personal safety tools. It is not an independent product test or a ranking of every product on the market. The examples below describe Whaleora products using their currently published specifications.\n\n## 1. Personal safety alarm\n\nA pull-pin alarm can create a loud signal and draw attention. Whaleora’s Personal SOS Alarm is specified at 130dB and includes a flashing LED. The AF-2004 supplier sheet lists a 130mAh Type-C rechargeable battery, about 90 minutes to charge and about 70 minutes of alarm duration. Consider whether you can clip it somewhere easy to reach and keep it charged.\n\n## 2. Safety whistle\n\nA whistle is a simple, battery-free signal tool. Whaleora’s Survival Whistle is a 120dB dual-tube, breath-powered model. It does require you to be able to reach it and blow it.\n\n## 3. Pepper spray\n\nPepper spray is a personal safety product that requires responsible storage, handling and familiarity with its safety mechanism. Whaleora’s OC canister has a stated range of up to 7 feet. Check current laws, transport rules and venue policies before carrying any spray product. Understand the instructions and limitations before use.\n\n## 4. Vehicle window breaker\n\nIf you travel by car, a vehicle escape tool serves a different purpose from an everyday carry alarm. Whaleora’s 92g Emergency Window Breaker is designed for suitable tempered side glass and includes a concealed seatbelt cutter. It is not designed to break laminated windscreens. Keep it secured and reachable inside the vehicle.\n\n## How to compare safety products\n\n- Purpose: Does it signal for help, help create distance, or address a vehicle escape scenario?\n- Accessibility: Can you reach it quickly without searching through a bag?\n- Activation: Do you understand the steps and can you practise them safely?\n- Maintenance: Does it need charging, inspection or replacement?\n- Limitations: What situations is it not designed for?\n- Rules: Are there local laws, airline restrictions, campus rules or venue policies?\n\n## A practical starter approach\n\nFor everyday travel, some people prefer a personal alarm or whistle. A person who drives regularly may also want a vehicle-specific escape tool. Pepper spray is a separate decision that requires additional care and checking applicable rules. There is no single product that is best for every person or situation.\n\n## Explore the Whaleora range\n\nCompare the [Personal SOS Alarm](/products/sos-alarm), [Survival Whistle](/products/whistle), [Pepper Spray](/products/pepperspray) and [Emergency Window Breaker](/products/windowbreaker) pages. Read the instructions and choose only products that fit your needs and local rules."
  }
];
