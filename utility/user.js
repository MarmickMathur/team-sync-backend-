module.exports = {
  getdashInfo: (result) => {
    let members = 0;
    let dueSoon = 0;
    let inprogress = 0;
    let closed = 0;
    let pieCharInfoStatus = {
      to_do: 0,
      in_progress: 0,
      approval: 0,
      done: 0,
    };
    let pieCharInfoPriority = {
      low: 0,
      high: 0,
      medium: 0,
    };
    for (let index = 0; index < result.teams.length; index++) {
      const element = result.teams[index];
      members += element.team.members.length;
    }

    for (let index = 0; index < result.assignedTickets.length; index++) {
      const element = result.assignedTickets[index];
      if (element.status == "in_progress") inprogress++;
      switch (element.status) {
        case "in_progress":
          pieCharInfoStatus.in_progress++;
          break;
        case "to_do":
          pieCharInfoStatus.to_do++;
          break;
        case "approval":
          pieCharInfoStatus.approval++;
          break;
        case "done":
          closed++;
          pieCharInfoStatus.done++;
          break;
        default:
          break;
      }
      switch (element.priority) {
        case "high":
          pieCharInfoPriority.high++;
          break;
        case "low":
          pieCharInfoPriority.low++;
          break;
        case "medium":
          pieCharInfoPriority.medium++;
          break;
        default:
          break;
      }
      if (element.deadline) {
        const deadlineDate = new Date(element.deadline);
        const now = new Date();
        const sevenDaysFromNow = new Date(
          now.getTime() + 7 * 24 * 60 * 60 * 1000
        ); // add 7 days in ms

        if (deadlineDate <= sevenDaysFromNow) {
          dueSoon++;
        }
      }
    }
    return {
      members,
      dueSoon,
      inprogress,
      pieCharInfoStatus,
      pieCharInfoPriority,
      closed,
    };
  },
};
