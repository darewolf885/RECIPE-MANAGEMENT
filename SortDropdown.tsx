import { motion } from "motion/react";
import { ArrowUpDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface SortDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="flex items-center gap-2"
    >
      <ArrowUpDown className="w-5 h-5 text-gray-600" />
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-48 rounded-xl border-2 border-gray-200 focus:border-orange-500">
          <SelectValue placeholder="Sort by..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="rating">Highest Rating</SelectItem>
          <SelectItem value="waitTime">Shortest Wait</SelectItem>
          <SelectItem value="prepTime">Fastest Prep</SelectItem>
          <SelectItem value="name">Name (A-Z)</SelectItem>
        </SelectContent>
      </Select>
    </motion.div>
  );
}
