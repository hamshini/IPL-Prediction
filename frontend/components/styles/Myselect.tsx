// src/components/styles/MySelect.tsx
import { customSelectStyles } from "@/lib/reactSelectStyles";
import Select from "react-select";

export default function MySelect(props: any) {
    return <Select {...props} styles={customSelectStyles} />;
}