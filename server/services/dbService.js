const prisma = require('../utils/prisma');


const createAudit = async (data) => {
  return await prisma.audit.create({
    data: {
      publicId: data.publicId,
      toolsData: data.toolsData,
      savingsData: data.savingsData,
      aiSummary: data.aiSummary,
      email: data.email,
      companyName: data.companyName,
      role: data.role,
      teamSize: data.teamSize,
    }
  });
};

const getAuditByPublicId = async (publicId) => {
  return await prisma.audit.findUnique({
    where: { publicId },
    select: {
      publicId: true,
      toolsData: true,
      savingsData: true,
      aiSummary: true,
      createdAt: true,
      // Stripping PII as per requirements
    }
  });
};

const updateAuditWithLead = async (publicId, leadInfo) => {
  return await prisma.audit.update({
    where: { publicId },
    data: {
      email: leadInfo.email,
      companyName: leadInfo.companyName,
      role: leadInfo.role,
      teamSize: leadInfo.teamSize?.toString(),
    }
  });
};

module.exports = { createAudit, getAuditByPublicId, updateAuditWithLead };
