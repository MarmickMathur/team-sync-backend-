const prisma = require("../utility/prismaLoader");

async function verifyOrg(req, res, next) {
  try {
    const uid = req.user.id;
    const oid = req.body.organization_id;
    const result = await prisma.userOrganization.findMany({
      where: {
        organizationId: oid,
        role: { in: ["owner", "admin"] }, // checking for the creator (owner)
      },
      include: {
        user: true, // get creator's user info
        organization: true, // get the organization info
      },
    });

    let flg = 0;
    let organization = null;
    for (let index = 0; index < result.length; index++) {
      const element = result[index];
      if (element.user.id == uid) {
        flg = 1;
        organization = element.organization;
      }
    }
    if (flg) {
      req.organization = organization;
      next();
    } else {
      console.log("here");
      throw new Error("user not owner");
    }
  } catch (err) {
    console.log(err);
    return res.status(401).json(err.message);
  }
}

module.exports = verifyOrg;
