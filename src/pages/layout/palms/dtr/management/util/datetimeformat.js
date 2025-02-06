export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
};
export const formatDateTime = (dateTimeString) => {
  const date = new Date(dateTimeString);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(date);
};

export const currentMonth = new Date().getMonth() + 1;

export const monthList = [
  { id: 1, label: "January" },
  { id: 2, label: "February" },
  { id: 3, label: "March" },
  { id: 4, label: "April" },
  { id: 5, label: "May" },
  { id: 6, label: "June" },
  { id: 7, label: "July" },
  { id: 8, label: "August" },
  { id: 9, label: "September" },
  { id: 10, label: "October" },
  { id: 11, label: "November" },
  { id: 12, label: "December" },
];

export const currentYear = new Date().getFullYear();

export const yearlist = [currentYear, currentYear - 1, currentYear - 2];

export const generateDateRange = (start, end) => {
  let startDate = new Date(start);
  const endDate = new Date(end);
  const range = [];

  while (startDate <= endDate) {
    range.push(startDate.toISOString().split("T")[0]); // Format YYYY-MM-DD
    startDate.setDate(startDate.getDate() + 1); // Move to the next day
  }

  return range;
};
