export default sortProductsByPriority = (products) => {
    const priorityOrder = { 'H': 1, 'M': 2, 'L': 3 };
    return products.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  };