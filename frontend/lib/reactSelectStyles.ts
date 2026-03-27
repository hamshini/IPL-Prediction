export const customSelectStyles = {
    control: (provided: any) => ({
        ...provided,
        color: "#111827",          // text inside the select
        backgroundColor: "#fff",   // background color
        borderColor: "#d1d5db",    // Tailwind gray-300
    }),
    menu: (provided: any) => ({
        ...provided,
        zIndex: 9999,
    }),
    option: (provided: any, state: any) => ({
        ...provided,
        color: "#111827",
        backgroundColor: state.isFocused ? "#e5e7eb" : "#fff",
        fontWeight: 500,
    }),
    singleValue: (provided: any) => ({
        ...provided,
        color: "#111827",
    }),
    multiValueLabel: (provided: any) => ({
        ...provided,
        color: "#111827",
    }),
    placeholder: (provided: any) => ({
        ...provided,
        color: "#6b7280", // placeholder gray
    }),
};

export const customSelectDarkStyles = {
    ...customSelectStyles,
    control: (provided: any) => ({
        ...provided,
        backgroundColor: "#0a0a0a",
        color: "#ededed",
        borderColor: "#555",
    }),
    option: (provided: any, state: any) => ({
        ...provided,
        color: state.isSelected ? "#fff" : "#ededed",
        backgroundColor: state.isFocused ? "#333" : "#0a0a0a",
    }),
};