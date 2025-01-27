export const filterContributionsByDate = (contributions, dateFilter) => {
    if (!dateFilter.year) {
      return contributions;
    }
  
    return contributions.filter(contribution => {
      const date = new Date(contribution.contributionDate);
      const matchesYear = date.getFullYear() === dateFilter.year;
      
      if (!dateFilter.month) {
        return matchesYear;
      }
      
      return matchesYear && date.getMonth() + 1 === dateFilter.month;
    });
  };