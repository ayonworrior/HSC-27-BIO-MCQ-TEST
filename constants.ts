
import { Chapter } from './types';

export const CHAPTERS: Chapter[] = [
  { id: 1, name: "কোষ ও এর গঠন", englishName: "Cell and its Structure" },
  { id: 2, name: "কোষ বিভাজন", englishName: "Cell Division" },
  { id: 3, name: "কোষ রসায়ন", englishName: "Cell Chemistry" },
  { id: 4, name: "অণুজীব", englishName: "Microorganisms" },
  { id: 5, name: "শৈবাল ও ছত্রাক", englishName: "Algae and Fungi" },
  { id: 6, name: "ব্রায়োফাইটা ও টেরিডোফাইটা", englishName: "Bryophyta and Pteridophyta" },
  { id: 7, name: "নগ্নবীজী ও আবৃতবীজী", englishName: "Gymnosperms and Angiosperms" },
  { id: 8, name: "টিস্যু ও টিস্যুতন্ত্র", englishName: "Tissue and Tissue System" },
  { id: 9, name: "উদ্ভিদ শারীরতত্ত্ব", englishName: "Plant Physiology" },
  { id: 10, name: "উদ্ভিদ প্রজনন", englishName: "Plant Reproduction" },
  { id: 11, name: "জীবপ্রযুক্তি", englishName: "Biotechnology" },
  { id: 12, name: "জীবের পরিবেশ, বিস্তার ও সংরক্ষণ", englishName: "Organism Environment" }
];

export const SCORING = {
  Easy: 1.0,
  Medium: 1.5,
  Hard: 2.0,
  Penalty: 0.0 // Change to 0.25 if negative marking is desired
};

export const QUIZ_CONFIGS = [
  { count: 20, time: 20 },
  { count: 25, time: 25 },
  { count: 50, time: 50 }
];
