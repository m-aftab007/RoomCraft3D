// The furniture catalogue shown in the sidebar.
//
// width and depth are the real footprint of each piece in metres, as seen
// from above, and height is how tall it stands. The 2D plan draws a piece as
// a rectangle of that footprint and the 3D view as a box of the full size.
// When GLTF models are added, each item will also get the path of its model
// here, so the 2D footprint and the 3D model come from the same entry.

const furniture = [
  {
    name: 'Kitchen',
    items: [
      { id: 'fridge', name: 'Fridge', width: 0.7, depth: 0.7, height: 1.8 },
      { id: 'stove', name: 'Stove', width: 0.6, depth: 0.6, height: 0.9 },
      { id: 'sink-unit', name: 'Sink Unit', width: 1.0, depth: 0.6, height: 0.9 },
      { id: 'counter', name: 'Counter', width: 1.2, depth: 0.6, height: 0.9 },
      { id: 'dining-table', name: 'Dining Table', width: 1.6, depth: 0.9, height: 0.75 },
    ],
  },
  {
    name: 'Bathroom',
    items: [
      { id: 'toilet', name: 'Toilet', width: 0.4, depth: 0.7, height: 0.75 },
      { id: 'basin', name: 'Basin', width: 0.6, depth: 0.45, height: 0.85 },
      { id: 'bathtub', name: 'Bathtub', width: 1.7, depth: 0.75, height: 0.55 },
      { id: 'shower', name: 'Shower', width: 0.9, depth: 0.9, height: 2.0 },
      { id: 'bath-cabinet', name: 'Cabinet', width: 0.6, depth: 0.35, height: 0.8 },
    ],
  },
  {
    name: 'Living Room',
    items: [
      { id: 'sofa-3', name: 'Sofa (3 Seat)', width: 2.1, depth: 0.9, height: 0.8 },
      { id: 'sofa-2', name: 'Sofa (2 Seat)', width: 1.6, depth: 0.9, height: 0.8 },
      { id: 'armchair', name: 'Armchair', width: 0.9, depth: 0.9, height: 0.8 },
      { id: 'coffee-table', name: 'Coffee Table', width: 1.1, depth: 0.6, height: 0.45 },
      { id: 'tv-unit', name: 'TV Unit', width: 1.6, depth: 0.45, height: 0.5 },
    ],
  },
  {
    name: 'Bedroom',
    items: [
      { id: 'double-bed', name: 'Double Bed', width: 1.6, depth: 2.0, height: 0.5 },
      { id: 'single-bed', name: 'Single Bed', width: 1.0, depth: 2.0, height: 0.5 },
      { id: 'wardrobe', name: 'Wardrobe', width: 1.8, depth: 0.6, height: 2.0 },
      { id: 'bedside-table', name: 'Bedside Table', width: 0.45, depth: 0.45, height: 0.5 },
      { id: 'dresser', name: 'Dresser', width: 1.2, depth: 0.5, height: 0.8 },
    ],
  },
  {
    name: 'Desks',
    items: [
      { id: 'study-desk', name: 'Study Desk', width: 1.2, depth: 0.6, height: 0.75 },
      { id: 'office-desk', name: 'Office Desk', width: 1.5, depth: 0.75, height: 0.75 },
      { id: 'corner-desk', name: 'Corner Desk', width: 1.4, depth: 1.4, height: 0.75 },
      { id: 'office-chair', name: 'Office Chair', width: 0.6, depth: 0.6, height: 0.9 },
      { id: 'bookshelf', name: 'Bookshelf', width: 0.9, depth: 0.3, height: 1.8 },
    ],
  },
  {
    name: 'Accessories - Deco',
    items: [
      { id: 'rug', name: 'Rug', width: 2.0, depth: 1.4, height: 0.02 },
      { id: 'floor-lamp', name: 'Floor Lamp', width: 0.4, depth: 0.4, height: 1.6 },
      { id: 'plant', name: 'Plant', width: 0.5, depth: 0.5, height: 1.0 },
      { id: 'side-table', name: 'Side Table', width: 0.5, depth: 0.5, height: 0.5 },
      { id: 'mirror', name: 'Mirror', width: 0.8, depth: 0.1, height: 1.7 },
    ],
  },
]

export default furniture
