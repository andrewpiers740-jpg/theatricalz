// lib/disclaimers.js - single source of truth for product disclaimer tagging.
// Pure functions only (no imports) so this runs in server pages, client cards and build scripts.

export const DISCLAIMERS = {
  'prop-money': {
    title: 'Prop Money',
    short: 'Prop money is for film, TV, stage and photography only. It is not legal tender.',
    body: [
      'All prop notes sold by Theatricalz are clearly marked as props and are not legal tender. They are supplied for film, television, stage, photography and similar creative productions only.',
      'Prop notes must never be spent, offered as payment, or presented as genuine currency. Laws about reproducing and using currency differ between countries and states, so you are responsible for making sure your use complies with the laws that apply where you are.',
      'Orders containing prop money may be refused, cancelled or reported to the relevant authorities if we believe the notes will be used for any purpose other than production props.',
    ],
  },
  radio: {
    title: 'Radio, Wireless & Scanner Equipment',
    short: 'Radio and wireless equipment may be regulated. You are responsible for lawful use.',
    body: [
      'Radio communications products, scanners, intercoms and wireless microphone, video and monitoring systems transmit or receive on radio frequencies. The frequencies, power levels and licensing rules that apply differ between countries and can change.',
      'Before you buy or use these products, check the requirements of the radio regulator in the country where you will operate them (in Australia, the Australian Communications and Media Authority). You are responsible for using the equipment lawfully, and for any licence it may need.',
      'Product specifications describe the manufacturer’s models. Features, bands and settings can vary by region.',
    ],
  },
  surveillance: {
    title: 'Cameras, Recording & Surveillance',
    short: 'Recording people or places may be restricted by privacy and surveillance laws.',
    body: [
      'Security cameras, dash cams, trail cameras and surveillance systems can record video, sound and images of people and places. Laws about recording, listening devices, privacy and notifying people differ between countries and states.',
      'You are responsible for making sure your installation and use of these products complies with the laws that apply where you use them.',
    ],
  },
  drone: {
    title: 'Drones & Remotely Piloted Aircraft',
    short: 'Drone use is regulated. Check aviation and privacy rules before you fly.',
    body: [
      'Drones and remotely piloted aircraft are regulated by the civil aviation authority in each country (in Australia, the Civil Aviation Safety Authority). Rules can cover registration, pilot accreditation, where and how high you can fly, and flying over people or property.',
      'Privacy laws can also apply to images and video captured by a drone. You are responsible for knowing and following the rules that apply where you fly.',
      'Lithium batteries supplied with drones can have shipping restrictions (see Lithium Batteries below).',
    ],
  },
  knife: {
    title: 'Knives & Bladed Tools',
    short: 'Bladed tools may have age and carry restrictions. Check your local laws.',
    body: [
      'Multi-tools, folding knives and other bladed tools can be subject to age restrictions and to laws about owning, carrying and using them in public. These laws differ between countries and between states and territories.',
      'By ordering a bladed product you confirm that you are of legal age and that you will use and carry it in line with the laws that apply to you. We may decline or cancel an order, or be unable to ship to some destinations, where a product is restricted.',
    ],
  },
  lithium: {
    title: 'Lithium Batteries',
    short: 'Lithium battery products can have shipping limits, especially for overseas orders.',
    body: [
      'Lithium-ion and other lithium batteries are classed as dangerous goods for transport. Carriers and countries limit how they can be shipped, and some products may not be available for air freight or for delivery to certain destinations.',
      'If a lithium battery product cannot be sent to your address, we will contact you to arrange an alternative or a refund before dispatch. Always follow the manufacturer’s instructions for charging, storing and disposing of batteries.',
    ],
  },
};

const strip = (n) => String(n || '').replace(/\([^)]*\)/g, '');

const RULES = {
  'prop-money': (p) => p.category === 'prop-money',
  drone: (p) =>
    /^DJI (Mini|Mavic|Air \d|Avata|Neo|Inspire|Matrice|Flip|Phantom)/i.test(p.name || '') &&
    !/case|bag|battery|filter|propeller|charger|hub|lens|guard|strap|stand|cable|adapter|goggles|controller|remote/i.test(strip(p.name)),
  surveillance: (p) =>
    /security camera|dash ?cam|trail camera|surveillance|body ?cam|app cam|igo cam/i.test(p.name || '') &&
    !/baby pin/i.test(p.name || ''),
  knife: (p) =>
    (/leatherman/i.test(`${p.brand || ''} ${p.name || ''}`) && /multi-?tool|knife|blade/i.test(p.name || '')) ||
    (/knife/i.test(p.name || '') && p.category === 'outdoor-optics'),
  radio: (p) =>
    /\b(UHF|VHF|DECT)\b|1\.9 ?GHz|scanner|two-way radio|walkie|CB radio|handheld radio|hand held radio|radio mic|intercom|wireless (microphone|mic|lav|system|in-ear|iem|video|transmit)|in-ear monitor system/i.test(p.name || '') &&
    !/security camera|trail|dash/i.test(p.name || ''),
  lithium: (p) =>
    /lithium|li-ion|power bank|battery pack|\bNP-F\d|\bNP-FZ|\bLP-E\d|\bEN-EL\d|\bBP-\d{3}|v-?mount battery|v-?lock battery|v-?mount.*\b(battery|\d+ ?Wh)\b/i.test(p.name || '') &&
    !/battery[- ]powered|charger|adapter|plate|case|dock|bracket|cable|holder|monitor module/i.test(p.name || ''),
};

export function getDisclaimerKeys(product) {
  if (!product) return [];
  return Object.keys(RULES).filter((k) => RULES[k](product));
}

export function hasDisclaimer(product) {
  return getDisclaimerKeys(product).length > 0;
}
