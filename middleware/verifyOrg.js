const prisma = require("../utility/prismaLoader");

async function verifyOrg(req, res, next) {
  try {
    const uid = req.user.id;
    const oid = req.body.organization_id;
    const { organization, user } = await prisma.userOrganization.findFirst({
      where: {
        organizationId: oid,
        role: { in: ["owner", "admin"] }, // checking for the creator (owner)
      },
      include: {
        user: true, // get creator's user info
        organization: true, // get the organization info
      },
    });
    if (user && uid == user.id) {
      req.organization = organization;
      next();
    } else {
      console.log("here");
      throw new Error("user not owner");
    }
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: "chude guru" });
  }
}

module.exports = verifyOrg;
