export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export const calculateBMI = (weight: number, height: number): number => {
  return weight / ((height / 100) ** 2)
}

