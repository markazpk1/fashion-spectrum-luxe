import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";
import product7 from "@/assets/product-7.jpg";
import product8 from "@/assets/product-8.jpg";
import product9 from "@/assets/product-9.jpg";
import product10 from "@/assets/product-10.jpg";
import product11 from "@/assets/product-11.jpg";
import product12 from "@/assets/product-12.jpg";
import product13 from "@/assets/product-13.jpg";
import product14 from "@/assets/product-14.jpg";
import product15 from "@/assets/product-15.jpg";
import product16 from "@/assets/product-16.jpg";

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: "New in" | "Sold out" | "Sale";
  category: string;
  style?: string;
  color?: string;
}

export const newArrivals: Product[] = [
  { id: "1", name: "Emerald Empress Medium Kaftan", price: 249, image: product1, badge: "New in", category: "Kaftans" },
  { id: "2", name: "Aegean Nights Co-Ord Set", price: 399, image: product2, badge: "New in", category: "Co-Ords" },
  { id: "3", name: "Coral Bloom Kaftan Dress", price: 199, image: product3, badge: "New in", category: "Dresses" },
  { id: "4", name: "Black Paisley Long Cape", price: 699, image: product4, badge: "New in", category: "Capes" },
  { id: "5", name: "Ruby Gala Beaded Maxi Dress", price: 499, image: product5, badge: "New in", category: "Dresses" },
  { id: "6", name: "Turquoise Butterfly Top", price: 199, image: product6, badge: "New in", category: "Tops" },
  { id: "7", name: "Ivory Gold Embroidered Slip Dress", price: 399, image: product7, badge: "New in", category: "Dresses" },
  { id: "8", name: "Tropical Tigress Kimono", price: 299, image: product8, badge: "New in", category: "Kaftans" },
  { id: "9", name: "Sapphire Belted Maxi Dress", price: 449, image: product9, badge: "New in", category: "Dresses" },
  { id: "10", name: "Rose Embroidered Bell Sleeve Tunic", price: 179, image: product10, badge: "New in", category: "Tops" },
  { id: "11", name: "Burnt Orange Palazzo Trousers", price: 299, image: product11, badge: "New in", category: "Bottoms" },
  { id: "12", name: "Emerald Velvet Blazer", price: 549, image: product12, badge: "New in", category: "Blazers" },
  { id: "13", name: "Pearl & Gold Halter Swimsuit", price: 189, image: product13, badge: "New in", category: "Swimwear" },
  { id: "14", name: "Teal Baroque Jumpsuit", price: 459, image: product14, badge: "New in", category: "Jumpsuits" },
  { id: "15", name: "Burgundy Floral Wrap Skirt", price: 249, image: product15, badge: "New in", category: "Bottoms" },
  { id: "16", name: "Champagne Sequin Evening Gown", price: 799, image: product16, badge: "New in", category: "Dresses" },
];

export const saleProducts: Product[] = [
  { id: "s1", name: "Postcards Kaftan Dress", price: 149, originalPrice: 199, image: product3, badge: "Sale", category: "Dresses" },
  { id: "s2", name: "Princess Of Savannah Maxi", price: 349, originalPrice: 499, image: product5, badge: "Sale", category: "Dresses" },
  { id: "s3", name: "Postcards Medium Kaftan", price: 199, originalPrice: 249, image: product1, badge: "Sale", category: "Kaftans" },
  { id: "s4", name: "Tropical Nights Slip Dress", price: 239, originalPrice: 299, image: product7, badge: "Sale", category: "Dresses" },
  { id: "s5", name: "Ocean Breeze Butterfly Top", price: 149, originalPrice: 199, image: product6, badge: "Sale", category: "Tops" },
  { id: "s6", name: "Midnight Garden Co-Ord Set", price: 299, originalPrice: 399, image: product2, badge: "Sale", category: "Co-Ords" },
  { id: "s7", name: "Sapphire Dreams Wrap Dress", price: 329, originalPrice: 449, image: product9, badge: "Sale", category: "Dresses" },
  { id: "s8", name: "Golden Hour Palazzo Pants", price: 199, originalPrice: 299, image: product11, badge: "Sale", category: "Bottoms" },
  { id: "s9", name: "Rose Garden Bell Top", price: 129, originalPrice: 179, image: product10, badge: "Sale", category: "Tops" },
  { id: "s10", name: "Baroque Garden Jumpsuit", price: 349, originalPrice: 459, image: product14, badge: "Sale", category: "Jumpsuits" },
];

export const bestSellers: Product[] = [
  { id: "b1", name: "Black Paisley Co-Ord Set", price: 399, image: product4, category: "Co-Ords" },
  { id: "b2", name: "Emerald Empress Blazer", price: 499, image: product1, category: "Blazers" },
  { id: "b3", name: "Ruby Gala V-Neck Slip Dress", price: 399, image: product5, category: "Dresses" },
  { id: "b4", name: "Aegean Nights Kaftan Dress", price: 199, image: product2, category: "Dresses" },
  { id: "b5", name: "Champagne Sequin Evening Gown", price: 799, image: product16, category: "Dresses" },
  { id: "b6", name: "Teal Baroque Jumpsuit", price: 459, image: product14, category: "Jumpsuits" },
  { id: "b7", name: "Ivory Gold Embroidered Slip Dress", price: 399, image: product7, category: "Dresses" },
  { id: "b8", name: "Emerald Velvet Blazer", price: 549, image: product12, category: "Blazers" },
];
