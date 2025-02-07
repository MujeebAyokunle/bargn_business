import { Bounce, toast } from "react-toastify";

export const successToast = (message: string) => {
    toast.success(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
    });
}

export const infoToast = (message: string) => {
    toast.info(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
    });
}

export const errorToast = (message: string) => {
    toast.error(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
    });
}

export const getPages = (currentPage: number, totalPages: number) => {
    const pages = [];
    const delta = 2; // Number of pages to show before and after the current page

    for (let i = 1; i <= totalPages; i++) {
        if (
            i === 1 ||
            i === totalPages ||
            (i >= currentPage - delta && i <= currentPage + delta)
        ) {
            pages.push(i);
        } else if (
            (i === currentPage - delta - 1 || i === currentPage + delta + 1) &&
            totalPages > delta * 2 + 2
        ) {
            pages.push("...");
        }
    }
    return [...new Set(pages)]; // Remove duplicate dots
};

export const toTitleCase = (str: string) => {
    return str
        .toLowerCase()
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

export const validateEmail = (value: string) => {
    // Regular expression to validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
        return "Email is required.";
    } else if (!emailRegex.test(value)) {
        return "Invalid email format.";
    }
    return "";
};