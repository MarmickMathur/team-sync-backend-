const { getOrgRole } = require("../utility/orgUtils");
const prisma = require("../utility/prismaLoader");
const { getdashInfo } = require("../utility/user");
const { getInfo } = require("./user");

module.exports = {
  getOrganization: async (req, res) => {
    try {
      const organization = await prisma.Organization.findFirst({
        where: {
          id: req.query.organization_id,
        },
      });
      res.json(organization);
    } catch (error) {
      console.log(error);
      req.json(error);
    }
  },
  getAllTickets: async (req, res) => {
    const { organization_id } = req.query;
    try {
      const tickets = await prisma.ticket.findMany({
        where: {
          team: {
            organizations: {
              some: {
                organizationId: organization_id,
              },
            },
          },
        },
        include: {
          creator_id: {
            select: {
              id: true,
              email: true,
              name: true,
              avatar: true,
              createdAt: true,
            },
          },
          assigned_to: {
            select: {
              id: true,
              email: true,
              name: true,
              avatar: true,
              createdAt: true,
            },
          },
          team: {
            include: {
              organizations: {
                where: {
                  organizationId: organization_id,
                },
                select: {
                  joinedAt: true,
                },
              },
            },
          },
        },
      });
      console.log(tickets);
      res.json(tickets);
    } catch (error) {
      console.log(error);
      res.send(error.message);
    }
  },
  getInfo: async (req, res) => {
    console.log("starting here");
    const { organization_id } = req.query;
    console.log(organization_id);
    try {
      const result = await prisma.organization.findFirst({
        where: {
          id: organization_id,
        },
        include: {
          teams: {
            include: {
              team: true,
            },
          },
          members: {
            include: {
              user: true,
            },
          },
        },
      });
      console.log(result);
      res.send("chal raha hai");
    } catch (error) {
      console.log(error);
      res.status(401).send(error.message);
    }
  },
  getMemberInfo: async (req, res) => {
    const { organization_id } = req.query;
    const { id } = req.params;
    try {
      const result = await prisma.user.findUnique({
        where: {
          id: id,
          organizations: {
            some: {
              organizationId: organization_id,
            },
          },
        },
        include: {
          assignedTickets: true,
          createdTickets: true,
          teams: {
            include: {
              team: {
                include: {
                  members: true,
                },
              },
            },
          },
        },
      });
      console.log(result);
      const {
        members,
        dueSoon,
        inprogress,
        pieCharInfoPriority,
        pieCharInfoStatus,
      } = getdashInfo(result);

      console.log(result.assignedTickets.length);
      res.json({
        teamCount: result.teams.length,
        memberCount: members,
        dueSoon,
        inprogress,
        completionPercentage:
          (inprogress / result.assignedTickets.length) * 100 != null
            ? (inprogress / result.assignedTickets.length) * 100
            : 100,
        pieCharInfoStatus,
        pieCharInfoPriority,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send(error.message);
    }
  },
  getTeams: async (req, res) => {
    const oid = req.query.organization_id;
    const uid = req.user.id;
    try {
      const userId = uid;
      const organizationId = oid;

      const teams = await prisma.team.findMany({
        where: {
          organizations: {
            some: { organizationId },
          },
        },
        select: {
          id: true,
          name: true,
          _count: {
            select: {
              Ticket: true, // Number of tickets in the team
              members: true, // Total member count
            },
          },
          members: {
            select: {
              user: {
                select: {
                  id: true,
                  name: true,
                  avatar: true,
                },
              },
              role: true,
            },
            orderBy: {
              joinedAt: "asc",
            },
          },
          organizations: {
            where: { organizationId },
            select: { joinedAt: true },
          },
        },
      });

      // Transform the results
      const result = teams.map((team) => {
        const allMembers = team.members;
        const currentUserMembership = allMembers.find(
          (m) => m.user.userId === userId
        );
        const otherMembers = allMembers
          .filter((m) => m.user.userId !== userId)
          .slice(0, 3);

        return {
          id: team.id,
          name: team.name,
          ticketCount: team._count.Ticket,
          totalMembers: team._count.members,
          userRole: currentUserMembership?.role || null,
          membersPreview: otherMembers.map((m) => ({
            ...m.user,
            role: m.role,
          })),
          organizationJoinDate: team.organizations[0]?.joinedAt,
        };
      });
      console.log(result);
      res.json(result);
    } catch (error) {
      console.log(error);
      res.json(error);
    }
  },
  getTeamCount: async (req, res) => {
    const { user_id, organization_id } = req.query;
    try {
      const teams = await prisma.team.findMany({
        where: {
          members: {
            some: {
              userId: user_id,
            },
          },
          organizations: {
            some: {
              organizationId: organization_id,
            },
          },
        },
      });
      console.log(teams);
      res.json({ count: teams.length });
    } catch (error) {
      console.log(error);
      res.json(error.message);
    }
  },
  addTeam: async (req, res) => {
    try {
      const newTeam = await prisma.Team.create({
        data: {
          name: req.body.name,
        },
      });
      console.log(newTeam);
      const updatedOrg = await prisma.organization.update({
        where: {
          id: req.organization.id,
        },
        data: {
          teams: {
            create: {
              team: {
                connect: { id: newTeam.id },
              },
            },
          },
        },
      });
      res.json(newTeam);
    } catch (error) {
      console.log(error);
      res.json(error);
    }
  },
  addMember: async (req, res) => {
    try {
      const org = await prisma.Organization.update({
        where: {
          id: req.organization.id,
        },
        data: {
          members: {
            create: {
              user: {
                connect: { id: req.body.member_id },
              },
              role: req.body.role,
            },
          },
        },
      });
      res.json(org);
    } catch (error) {
      console.log(error);
      res.json(error);
    }
  },
  getMembers: async (req, res) => {
    try {
      const { members } = await prisma.Organization.findUnique({
        where: {
          id: req.query.organization_id,
        },
        include: {
          members: true,
        },
      });
      console.log(members);
      res.json(members);
    } catch (error) {
      console.log(error);
      res.json(error);
    }
  },
  deleteTeam: async (req, res) => {
    try {
      const { teamId } = await prisma.TeamOrganization.delete({
        where: {
          teamId_organizationId: {
            teamId: req.body.team_id,
            organizationId: req.organization.id,
          },
        },
      });
      res.json(teamId);
    } catch (error) {
      console.log(error);
      res.json(error);
    }
  },
  deleteMember: async (req, res) => {
    if (
      (await getOrgRole(req.body.member_id, req.organization.id)) == "owner"
    ) {
      res.send("cannot delete owner");
      return;
    }
    try {
      const { userId } = await prisma.UserOrganization.delete({
        where: {
          userId_organizationId: {
            userId: req.body.member_id,
            organizationId: req.organization.id,
          },
        },
      });
      res.json(userId);
    } catch (error) {
      console.log(error);
      res.json(error);
    }
  },
  patchMember: async (req, res) => {
    if (
      (await getOrgRole(req.body.member_id, req.organization.id)) == "owner"
    ) {
      res.send("cannot change owner's role");
      return;
    }
    if (req.body.role == "owner") {
      res.send("cannot set owners choose admin");
      return;
    }
    try {
      const { userId } = await prisma.UserOrganization.update({
        where: {
          userId_organizationId: {
            userId: req.body.member_id,
            organizationId: req.organization.id,
          },
        },
        data: {
          role: req.body.role,
        },
      });
      res.json(userId);
    } catch (error) {
      console.log(error);
      res.json(error);
    }
  },
  patchOrg: async (req, res) => {
    try {
      const org = await prisma.Organization.update({
        where: {
          id: req.organization.id,
        },
        data: {
          name: req.body.name,
        },
      });
      res.json(org);
    } catch (error) {
      console.log(error);
      req.json(error);
    }
  },
};
