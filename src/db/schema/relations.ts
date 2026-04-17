import { relations } from "drizzle-orm/relations";
import { accounts, media, mediaFolders, users, newsletterCampaigns, sections, pageGroups, pages, auditLogs, posts, postCategories, homepagePartners, servicesCategories, services, homepageHero, homepageFeatures, homepageTestimonials, storeCategories, storeProducts, storeProductVariants, storeProductReviews, storeOrderStatuses, storeOrders, storeOrderItems, storeOrderReturns, storeCampaigns, storeOffers, branches, pmsProjects, pmsProjectMembers, pmsTasks, pmsTaskStatuses, pmsTaskComments, pmsTaskAttachments, pmsTimeEntries, pmsTeams, pmsActivityLogs, aboutHero, aboutCompany, aboutTimeline, aboutTeamMembers, aboutCertificates, aboutSeo, homepageSeo, homepageCta, servicesSeo, servicesCta, servicesHero, servicesProcess, servicesPricing, pmsLabels, pmsTaskLabels, accountRoles, roles, storeCampaignProducts, pmsProjectTeams, pmsTeamMembers, rolePagePermissions } from "./index";

export const mediaRelations = relations(media, ({ one, many }) => ({
	account: one(accounts, {
		fields: [media.createdBy],
		references: [accounts.id]
	}),
	mediaFolder: one(mediaFolders, {
		fields: [media.folderId],
		references: [mediaFolders.id]
	}),
	posts: many(posts),
	homepagePartners: many(homepagePartners),
	services: many(services),
	servicesCategories: many(servicesCategories),
	homepageHeroes: many(homepageHero),
	homepageFeatures: many(homepageFeatures),
	homepageTestimonials: many(homepageTestimonials),
	storeCategories: many(storeCategories),
	storeProducts: many(storeProducts),
	storeProductVariants: many(storeProductVariants),
	storeCampaigns: many(storeCampaigns),
	storeOffers: many(storeOffers),
	pmsTaskAttachments: many(pmsTaskAttachments),
	aboutHeroes: many(aboutHero),
	aboutCompanies: many(aboutCompany),
	aboutTimelines: many(aboutTimeline),
	aboutTeamMembers: many(aboutTeamMembers),
	aboutCertificates: many(aboutCertificates),
	aboutSeos: many(aboutSeo),
	homepageSeos: many(homepageSeo),
	homepageCtas: many(homepageCta),
	servicesSeos: many(servicesSeo),
	servicesCtas: many(servicesCta),
	servicesHeroes: many(servicesHero),
}));

export const accountsRelations = relations(accounts, ({ one, many }) => ({
	media: many(media),
	users: one(users, {
		fields: [accounts.id],
		references: [users.id]
	}),
	mediaFolders: many(mediaFolders),
	posts: many(posts),
	pmsProjects: many(pmsProjects),
	pmsProjectMembers: many(pmsProjectMembers),
	pmsTasks_assigneeId: many(pmsTasks, {
		relationName: "pmsTasks_assigneeId_accounts_id"
	}),
	pmsTasks_reporterId: many(pmsTasks, {
		relationName: "pmsTasks_reporterId_accounts_id"
	}),
	pmsTaskComments: many(pmsTaskComments),
	pmsTaskAttachments: many(pmsTaskAttachments),
	pmsTimeEntries: many(pmsTimeEntries),
	pmsTeams: many(pmsTeams),
	pmsActivityLogs: many(pmsActivityLogs),
	accountRoles: many(accountRoles),
	pmsTeamMembers: many(pmsTeamMembers),
}));

export const mediaFoldersRelations = relations(mediaFolders, ({ one, many }) => ({
	media: many(media),
	account: one(accounts, {
		fields: [mediaFolders.createdBy],
		references: [accounts.id]
	}),
	mediaFolder: one(mediaFolders, {
		fields: [mediaFolders.parentId],
		references: [mediaFolders.id],
		relationName: "mediaFolders_parentId_mediaFolders_id"
	}),
	mediaFolders: many(mediaFolders, {
		relationName: "mediaFolders_parentId_mediaFolders_id"
	}),
}));

export const newsletterCampaignsRelations = relations(newsletterCampaigns, ({ one }) => ({
	users: one(users, {
		fields: [newsletterCampaigns.createdBy],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({ many }) => ({
	newsletterCampaigns: many(newsletterCampaigns),
	accounts: many(accounts),
	auditLogs: many(auditLogs),
}));

export const pageGroupsRelations = relations(pageGroups, ({ one, many }) => ({
	section: one(sections, {
		fields: [pageGroups.sectionId],
		references: [sections.id]
	}),
	pages: many(pages),
}));

export const sectionsRelations = relations(sections, ({ many }) => ({
	pageGroups: many(pageGroups),
	pages: many(pages),
}));

export const pagesRelations = relations(pages, ({ one, many }) => ({
	pageGroup: one(pageGroups, {
		fields: [pages.groupId],
		references: [pageGroups.id]
	}),
	page: one(pages, {
		fields: [pages.parentId],
		references: [pages.id],
		relationName: "pages_parentId_pages_id"
	}),
	pages: many(pages, {
		relationName: "pages_parentId_pages_id"
	}),
	section: one(sections, {
		fields: [pages.sectionId],
		references: [sections.id]
	}),
	rolePagePermissions: many(rolePagePermissions),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
	users: one(users, {
		fields: [auditLogs.actorId],
		references: [users.id]
	}),
}));

export const postsRelations = relations(posts, ({ one }) => ({
	account: one(accounts, {
		fields: [posts.authorId],
		references: [accounts.id]
	}),
	postCategory: one(postCategories, {
		fields: [posts.categoryId],
		references: [postCategories.id]
	}),
	media: one(media, {
		fields: [posts.coverImageId],
		references: [media.id]
	}),
}));

export const postCategoriesRelations = relations(postCategories, ({ many }) => ({
	posts: many(posts),
}));

export const homepagePartnersRelations = relations(homepagePartners, ({ one }) => ({
	media: one(media, {
		fields: [homepagePartners.logoId],
		references: [media.id]
	}),
}));

export const servicesRelations = relations(services, ({ one, many }) => ({
	servicesCategory: one(servicesCategories, {
		fields: [services.categoryId],
		references: [servicesCategories.id]
	}),
	media: one(media, {
		fields: [services.imageId],
		references: [media.id]
	}),
	servicesProcesses: many(servicesProcess),
	servicesPricings: many(servicesPricing),
}));

export const servicesCategoriesRelations = relations(servicesCategories, ({ one, many }) => ({
	services: many(services),
	media: one(media, {
		fields: [servicesCategories.imageId],
		references: [media.id]
	}),
	servicesCategory: one(servicesCategories, {
		fields: [servicesCategories.parentId],
		references: [servicesCategories.id],
		relationName: "servicesCategories_parentId_servicesCategories_id"
	}),
	servicesCategories: many(servicesCategories, {
		relationName: "servicesCategories_parentId_servicesCategories_id"
	}),
}));

export const homepageHeroRelations = relations(homepageHero, ({ one }) => ({
	media: one(media, {
		fields: [homepageHero.imageId],
		references: [media.id]
	}),
}));

export const homepageFeaturesRelations = relations(homepageFeatures, ({ one }) => ({
	media: one(media, {
		fields: [homepageFeatures.imageId],
		references: [media.id]
	}),
}));

export const homepageTestimonialsRelations = relations(homepageTestimonials, ({ one }) => ({
	media: one(media, {
		fields: [homepageTestimonials.avatarId],
		references: [media.id]
	}),
}));

export const storeCategoriesRelations = relations(storeCategories, ({ one, many }) => ({
	media: one(media, {
		fields: [storeCategories.imageId],
		references: [media.id]
	}),
	storeCategory: one(storeCategories, {
		fields: [storeCategories.parentId],
		references: [storeCategories.id],
		relationName: "storeCategories_parentId_storeCategories_id"
	}),
	storeCategories: many(storeCategories, {
		relationName: "storeCategories_parentId_storeCategories_id"
	}),
	storeProducts: many(storeProducts),
	storeOffers: many(storeOffers),
}));

export const storeProductsRelations = relations(storeProducts, ({ one, many }) => ({
	storeCategory: one(storeCategories, {
		fields: [storeProducts.categoryId],
		references: [storeCategories.id]
	}),
	media: one(media, {
		fields: [storeProducts.coverImageId],
		references: [media.id]
	}),
	storeProductVariants: many(storeProductVariants),
	storeProductReviews: many(storeProductReviews),
	storeOrderItems: many(storeOrderItems),
	storeOffers: many(storeOffers),
	storeCampaignProducts: many(storeCampaignProducts),
}));

export const storeProductVariantsRelations = relations(storeProductVariants, ({ one, many }) => ({
	media: one(media, {
		fields: [storeProductVariants.imageId],
		references: [media.id]
	}),
	storeProduct: one(storeProducts, {
		fields: [storeProductVariants.productId],
		references: [storeProducts.id]
	}),
	storeOrderItems: many(storeOrderItems),
}));

export const storeProductReviewsRelations = relations(storeProductReviews, ({ one }) => ({
	storeProduct: one(storeProducts, {
		fields: [storeProductReviews.productId],
		references: [storeProducts.id]
	}),
}));

export const storeOrdersRelations = relations(storeOrders, ({ one, many }) => ({
	storeOrderStatus: one(storeOrderStatuses, {
		fields: [storeOrders.statusId],
		references: [storeOrderStatuses.id]
	}),
	storeOrderItems: many(storeOrderItems),
	storeOrderReturns: many(storeOrderReturns),
}));

export const storeOrderStatusesRelations = relations(storeOrderStatuses, ({ many }) => ({
	storeOrders: many(storeOrders),
}));

export const storeOrderItemsRelations = relations(storeOrderItems, ({ one }) => ({
	storeOrder: one(storeOrders, {
		fields: [storeOrderItems.orderId],
		references: [storeOrders.id]
	}),
	storeProduct: one(storeProducts, {
		fields: [storeOrderItems.productId],
		references: [storeProducts.id]
	}),
	storeProductVariant: one(storeProductVariants, {
		fields: [storeOrderItems.variantId],
		references: [storeProductVariants.id]
	}),
}));

export const storeOrderReturnsRelations = relations(storeOrderReturns, ({ one }) => ({
	storeOrder: one(storeOrders, {
		fields: [storeOrderReturns.orderId],
		references: [storeOrders.id]
	}),
}));

export const storeCampaignsRelations = relations(storeCampaigns, ({ one, many }) => ({
	media: one(media, {
		fields: [storeCampaigns.bannerImageId],
		references: [media.id]
	}),
	storeCampaignProducts: many(storeCampaignProducts),
}));

export const storeOffersRelations = relations(storeOffers, ({ one }) => ({
	media: one(media, {
		fields: [storeOffers.bannerImageId],
		references: [media.id]
	}),
	storeCategory: one(storeCategories, {
		fields: [storeOffers.categoryId],
		references: [storeCategories.id]
	}),
	storeProduct: one(storeProducts, {
		fields: [storeOffers.productId],
		references: [storeProducts.id]
	}),
}));

export const pmsProjectsRelations = relations(pmsProjects, ({ one, many }) => ({
	branch: one(branches, {
		fields: [pmsProjects.branchId],
		references: [branches.id]
	}),
	account: one(accounts, {
		fields: [pmsProjects.createdBy],
		references: [accounts.id]
	}),
	pmsProjectMembers: many(pmsProjectMembers),
	pmsTasks: many(pmsTasks),
	pmsActivityLogs: many(pmsActivityLogs),
	pmsProjectTeams: many(pmsProjectTeams),
}));

export const branchesRelations = relations(branches, ({ many }) => ({
	pmsProjects: many(pmsProjects),
}));

export const pmsProjectMembersRelations = relations(pmsProjectMembers, ({ one }) => ({
	account: one(accounts, {
		fields: [pmsProjectMembers.accountId],
		references: [accounts.id]
	}),
	pmsProject: one(pmsProjects, {
		fields: [pmsProjectMembers.projectId],
		references: [pmsProjects.id]
	}),
}));

export const pmsTasksRelations = relations(pmsTasks, ({ one, many }) => ({
	account_assigneeId: one(accounts, {
		fields: [pmsTasks.assigneeId],
		references: [accounts.id],
		relationName: "pmsTasks_assigneeId_accounts_id"
	}),
	pmsTask: one(pmsTasks, {
		fields: [pmsTasks.parentTaskId],
		references: [pmsTasks.id],
		relationName: "pmsTasks_parentTaskId_pmsTasks_id"
	}),
	pmsTasks: many(pmsTasks, {
		relationName: "pmsTasks_parentTaskId_pmsTasks_id"
	}),
	pmsProject: one(pmsProjects, {
		fields: [pmsTasks.projectId],
		references: [pmsProjects.id]
	}),
	account_reporterId: one(accounts, {
		fields: [pmsTasks.reporterId],
		references: [accounts.id],
		relationName: "pmsTasks_reporterId_accounts_id"
	}),
	pmsTaskStatus: one(pmsTaskStatuses, {
		fields: [pmsTasks.statusId],
		references: [pmsTaskStatuses.id]
	}),
	pmsTaskComments: many(pmsTaskComments),
	pmsTaskAttachments: many(pmsTaskAttachments),
	pmsTimeEntries: many(pmsTimeEntries),
	pmsActivityLogs: many(pmsActivityLogs),
	pmsTaskLabels: many(pmsTaskLabels),
}));

export const pmsTaskStatusesRelations = relations(pmsTaskStatuses, ({ many }) => ({
	pmsTasks: many(pmsTasks),
}));

export const pmsTaskCommentsRelations = relations(pmsTaskComments, ({ one }) => ({
	account: one(accounts, {
		fields: [pmsTaskComments.authorId],
		references: [accounts.id]
	}),
	pmsTask: one(pmsTasks, {
		fields: [pmsTaskComments.taskId],
		references: [pmsTasks.id]
	}),
}));

export const pmsTaskAttachmentsRelations = relations(pmsTaskAttachments, ({ one }) => ({
	media: one(media, {
		fields: [pmsTaskAttachments.mediaId],
		references: [media.id]
	}),
	pmsTask: one(pmsTasks, {
		fields: [pmsTaskAttachments.taskId],
		references: [pmsTasks.id]
	}),
	account: one(accounts, {
		fields: [pmsTaskAttachments.uploaderId],
		references: [accounts.id]
	}),
}));

export const pmsTimeEntriesRelations = relations(pmsTimeEntries, ({ one }) => ({
	account: one(accounts, {
		fields: [pmsTimeEntries.accountId],
		references: [accounts.id]
	}),
	pmsTask: one(pmsTasks, {
		fields: [pmsTimeEntries.taskId],
		references: [pmsTasks.id]
	}),
}));

export const pmsTeamsRelations = relations(pmsTeams, ({ one, many }) => ({
	account: one(accounts, {
		fields: [pmsTeams.creatorId],
		references: [accounts.id]
	}),
	pmsProjectTeams: many(pmsProjectTeams),
	pmsTeamMembers: many(pmsTeamMembers),
}));

export const pmsActivityLogsRelations = relations(pmsActivityLogs, ({ one }) => ({
	account: one(accounts, {
		fields: [pmsActivityLogs.accountId],
		references: [accounts.id]
	}),
	pmsProject: one(pmsProjects, {
		fields: [pmsActivityLogs.projectId],
		references: [pmsProjects.id]
	}),
	pmsTask: one(pmsTasks, {
		fields: [pmsActivityLogs.taskId],
		references: [pmsTasks.id]
	}),
}));

export const aboutHeroRelations = relations(aboutHero, ({ one }) => ({
	media: one(media, {
		fields: [aboutHero.backgroundImageId],
		references: [media.id]
	}),
}));

export const aboutCompanyRelations = relations(aboutCompany, ({ one }) => ({
	media: one(media, {
		fields: [aboutCompany.coverImageId],
		references: [media.id]
	}),
}));

export const aboutTimelineRelations = relations(aboutTimeline, ({ one }) => ({
	media: one(media, {
		fields: [aboutTimeline.imageId],
		references: [media.id]
	}),
}));

export const aboutTeamMembersRelations = relations(aboutTeamMembers, ({ one }) => ({
	media: one(media, {
		fields: [aboutTeamMembers.avatarId],
		references: [media.id]
	}),
}));

export const aboutCertificatesRelations = relations(aboutCertificates, ({ one }) => ({
	media: one(media, {
		fields: [aboutCertificates.imageId],
		references: [media.id]
	}),
}));

export const aboutSeoRelations = relations(aboutSeo, ({ one }) => ({
	media: one(media, {
		fields: [aboutSeo.ogImageId],
		references: [media.id]
	}),
}));

export const homepageSeoRelations = relations(homepageSeo, ({ one }) => ({
	media: one(media, {
		fields: [homepageSeo.ogImageId],
		references: [media.id]
	}),
}));

export const homepageCtaRelations = relations(homepageCta, ({ one }) => ({
	media: one(media, {
		fields: [homepageCta.backgroundImageId],
		references: [media.id]
	}),
}));

export const servicesSeoRelations = relations(servicesSeo, ({ one }) => ({
	media: one(media, {
		fields: [servicesSeo.ogImageId],
		references: [media.id]
	}),
}));

export const servicesCtaRelations = relations(servicesCta, ({ one }) => ({
	media: one(media, {
		fields: [servicesCta.bgImageId],
		references: [media.id]
	}),
}));

export const servicesHeroRelations = relations(servicesHero, ({ one }) => ({
	media: one(media, {
		fields: [servicesHero.imageId],
		references: [media.id]
	}),
}));

export const servicesProcessRelations = relations(servicesProcess, ({ one }) => ({
	service: one(services, {
		fields: [servicesProcess.serviceId],
		references: [services.id]
	}),
}));

export const servicesPricingRelations = relations(servicesPricing, ({ one }) => ({
	service: one(services, {
		fields: [servicesPricing.serviceId],
		references: [services.id]
	}),
}));

export const pmsTaskLabelsRelations = relations(pmsTaskLabels, ({ one }) => ({
	pmsLabel: one(pmsLabels, {
		fields: [pmsTaskLabels.labelId],
		references: [pmsLabels.id]
	}),
	pmsTask: one(pmsTasks, {
		fields: [pmsTaskLabels.taskId],
		references: [pmsTasks.id]
	}),
}));

export const pmsLabelsRelations = relations(pmsLabels, ({ many }) => ({
	pmsTaskLabels: many(pmsTaskLabels),
}));

export const accountRolesRelations = relations(accountRoles, ({ one }) => ({
	account: one(accounts, {
		fields: [accountRoles.accountId],
		references: [accounts.id]
	}),
	role: one(roles, {
		fields: [accountRoles.roleId],
		references: [roles.id]
	}),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
	accountRoles: many(accountRoles),
	rolePagePermissions: many(rolePagePermissions),
}));

export const storeCampaignProductsRelations = relations(storeCampaignProducts, ({ one }) => ({
	storeCampaign: one(storeCampaigns, {
		fields: [storeCampaignProducts.campaignId],
		references: [storeCampaigns.id]
	}),
	storeProduct: one(storeProducts, {
		fields: [storeCampaignProducts.productId],
		references: [storeProducts.id]
	}),
}));

export const pmsProjectTeamsRelations = relations(pmsProjectTeams, ({ one }) => ({
	pmsProject: one(pmsProjects, {
		fields: [pmsProjectTeams.projectId],
		references: [pmsProjects.id]
	}),
	pmsTeam: one(pmsTeams, {
		fields: [pmsProjectTeams.teamId],
		references: [pmsTeams.id]
	}),
}));

export const pmsTeamMembersRelations = relations(pmsTeamMembers, ({ one }) => ({
	account: one(accounts, {
		fields: [pmsTeamMembers.accountId],
		references: [accounts.id]
	}),
	pmsTeam: one(pmsTeams, {
		fields: [pmsTeamMembers.teamId],
		references: [pmsTeams.id]
	}),
}));

export const rolePagePermissionsRelations = relations(rolePagePermissions, ({ one }) => ({
	page: one(pages, {
		fields: [rolePagePermissions.pageId],
		references: [pages.id]
	}),
	role: one(roles, {
		fields: [rolePagePermissions.roleId],
		references: [roles.id]
	}),
}));