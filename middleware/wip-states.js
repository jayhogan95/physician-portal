const wipState = {};

wipState.apptBooked = ["Delivery - Staged for RT"];

wipState.awaitConfirmation = ["RCM - ABN Needed",
							   "RCM - Adjuster To Review",
							   "RCM - Base Equipment Information",
							   "RCM - Compliance Issue",
							   "RCM - Compliance Sent to RCM",
							   "RCM - Date Line on DL Ticket",
							   "RCM - Duplicate Order",
							   "RCM - Fixed",
							   "RCM - In Transit",
							   "RCM - Incomplete Delivery Ticket",
							   "RCM - Insufficient Quantity",
							   "RCM - Insurance Issue",
							   "RCM - Item Too Soon",
							   "RCM - Medical Records Needed",
							   "RCM - Missing Items on DL ticket",
							   "RCM - MULTI",
							   "RCM - Need MD Information",
							   "RCM - Need O2 Documentation",
							   "RCM - No Delivery Ticket Received",
							   "RCM - No PAR Ready To Confirm",
							   "RCM - No Pricing",
							   "RCM - No Signature on F2F",
							   "RCM - Non Qualifying Diagnosis",
							   "RCM - Over-Utilization",
							   "RCM - PAR Needed",
							   "RCM - PAR to Log",
							   "RCM - PMD Ready to Confirm",
							   "RCM - Primary Ins Not Checked",
							   "RCM - Private Pay Order",
							   "RCM - Ready To Confirm",
							   "RCM - Refill Request Missing/Invalid",
							   "RCM - S/N Needed",
							   "RCM - Secondary Ins Not Checked",
							   "RCM - Shipped Order - Ready To Confirm",
							   "RCM - Signature Line On DL Ticket",
							   "RCM - Sleep Study Needed",
							   "RCM - Stamp Date Issue",
							   "RCM - Stamp Date Missing",
							   "RCM - SWO",
							   "RCM - TRACKING # ISSUE"
];

wipState.billingReview = ["Billing - Ins Chg: New Ins Needed",
						   "Billing - Ins Chg: PA Required",
						   "Billing - Ins Chg: Review Needed",
						   "Billing - O2 - Unconfirmed CMN pending",
						   "Billing - Past Due Balance/Credit Hold",
						   "Billing - Post Cash/Check",
						   "Billing - S/O Capped Retraction",
						   "Billing - S/O Rebilling",
						   "Billing - S/O Recalculate",
						   "Billing - Unable to Confirm",
						   "Billing - Work Comp/MVA Pending",
						   "Billing Department"
];

wipState.delivered = ["#5 IDS - Unit on Patient", 
					  "#6 IDS - Unit Returned"
];

wipState.idsOrdPending = ["#1 IDS - New Order",
						  "#2 IDS - Rx Update Required",
						  "#3 IDS - Awaiting Patient Contact"
];

wipState.idsOrdStaged = ["#4 IDS - Staged for Delivery"];

wipState.inWarehouse = ["PAP Supply - 6 Ready for CPAP Drop Ship",
						"PAP Supply - 7 Uploaded to CPAP Drop Ship",
						"Pharmacy - Staged for Shipment",
						"Shipping 1 - Warehouse Shipping",
						"Shipping 2 - VGM Shipping"
];

wipState.misc = ["Apacheta Updates Required",
				 "Appoint 360 - Hold",
				 "Customer Service create P/U",
				 "Internal - AHCAH Confirmation Issues",
				 "Internal - Coastal Conversion",
				 "Internal - Follow Up Required",
				 "Internal - Insufficient Qty",
				 "Internal - Scanning Needed",
				 "Internal - Validate RT Paperwork"
];

wipState.notApplic = ["Med Call Complete",
					  "Resupply Department Correction",
					  "S&B - API Pending",
					  "S&B - AX Exception",
					  "S&B - Docs Needed 1 - Awaiting Initial Paperwork",
					  "S&B - Docs Needed 2a - PT Sig Hold",
					  "S&B - Docs Needed 2b - PT Sig F/U",
					  "S&B - Docs Needed 3a - Dr Sig Hold",
					  "S&B - Docs Needed 3b - Dr Sig F/U",
					  "S&B - Docs Needed 4a - Rx Hold",
					  "S&B - Docs Needed 4b - Rx F/U",
					  "S&B - Docs Needed 5 - Dx Issue",
					  "S&B - Docs Needed 6 - INS Eligibility",
					  "S&B - Docs Needed 7 - Multiple Needs",
					  "S&B - PA Analytix Exception",
					  "S&B - PA Analytix Failed",
					  "S&B - PA Analytix Open",
					  "S&B - PA Analytix Pending/Submitted",
					  "Warehouse - Repair In",
					  "Warehouse - Repair Out"
];

wipState.withScheduling = ["Scheduling - Re-Schedule Appointment",
						   "Scheduling - Schedule RT",
						   "Scheduling App 1 - Staged",
						   "Scheduling App 2 - In Process",
						   "Scheduling App 3 - No Show/Rebook",
						   "Scheduling App 4 - Cancel/Rebook",
						   "Scheduling App 5 - Void Review"
];

wipState.pendingPatientContact = ["Remote Ship - Rescheduling PT Needs Contact"];

wipState.priAuthPending = ["PAP Supply - PA Analytix Failed",
						   "PAP Supply - PA Analytix Open",
						   "PAP Supply - PA Analytix Pending",
						   "Prior Auth 1a - Staged",
						   "Prior Auth 1b - Analytix Staged",
						   "Prior Auth 2a - Submitted",
						   "Prior Auth 2b - Analytix Submitted",
						   "Prior Auth 3 - Approved",
						   "Prior Auth 4a - Denied",
						   "Prior Auth 4B - Denied P2P",
						   "Prior Auth 5 - Post Appointment Update"
];

wipState.ptReqDelay = ["Remote Ship - PT Requested Delay"];

wipState.qualPending = ["All Call - Hold", 
						 "HC - 5 O2 Restart Pending Documentation", 
						 "HC - 5 O2 Restart CMN Sent", 
						 "HC - 5 O2 Restart to Cust Srv", 
						 "Misc - Conversion (DO NOT CONFIRM)", 
						 "Misc - Resupply (Do NOT Confirm)", 
						 "Misc - TEST", 
						 "Now Medicare / Medicaid DME", 
						 "Now Medicare / Medicaid PAP",
						 "Outstanding - Discharge Date Needed",
						 "Outstanding - Documentation Needed (DME/Other)",
						 "Outstanding - F2F Notes Needed",
						 "Outstanding - Follow-up With Patient",
						 "Outstanding - Loaner Follow Up",
						 "Outstanding - Post Appointment Doc's Needed",
						 "Outstanding - Wrong Insurance (F/U Patient)",
						 "PAP QUAL 1A - Staged",
						 "PAP QUAL 1A - Staged (RUSH ORDER)",
						 "PAP QUAL 1C - Staged (Internal Qual Required)",
						 "PAP QUAL 2A - Docs Needed 1 - Contact Required",
						 "PAP QUAL 2A - Docs Needed 2 - 1st Req Sent",
						 "PAP QUAL 2A - Docs Needed 3 - 2nd Req Sent",
						 "PAP QUAL 2A - Docs Needed 4 - 3rd Req Sent",
						 "PAP QUAL 2B - PT Follow Up 1 - Contact Required",
						 "PAP QUAL 2B - PT Follow Up 2 - 1st Req Sent",
						 "PAP QUAL 2B - PT Follow Up 3 - 2nd Req Sent",
						 "PAP QUAL 2B - PT Follow Up 4 - 3rd Req Sent",
						 "PAP QUAL 3 - Internal Review Required",
						 "PAP QUAL 4A - PA Issues (Urgent)",
						 "PAP Supply - 1a Qualification",
						 "PAP Supply - 1b Qualification (Auto Ship)",
						 "PAP Supply - 2a Documentation Needed",
						 "PAP Supply - 2B Download Needed",
						 "PAP Supply - 2c CMN Sent",
						 "PAP Supply - 2d CMN Received",
						 "PAP Supply - 2e Internal Follow Up",
						 "PAP Supply - 3 PA Required",
						 "PAP Supply - 4 Pending Copay",
						 "PAP Supply - 5 Ready to Upload",
						 "PAP Supply - Analytix 1 Approved",
						 "PAP Supply - Analytix 2 NOT Approved",
						 "PAP Supply - Analytix 3 Failed to Ship",
						 "PAP Supply - Analytix 4 SD Card Req",
						 "PAP Supply - Insurance change",
						 "PAP Supply - RUSH",
						 "PAP Supply - Sleep Supply Order",
						 "Pharmacy - In Process",
						 "Prochant - Back to Prochant",
						 "Prochant - Insurance Verification"
];

wipState.remoteSetupPend = ["Remote Ship - 1 Order Item Updates",
							"Remote Ship - 2 Send Setup Email",
							"Remote Ship - 3 Docusign to be Sent",
							"Remote Ship - 4 Docusign Pending",
							"Remote Ship - 5 Machine Setting Pending",
							"Remote Ship - 6 Shipment Pending",
							"Remote Ship - A Docs to Be Mailed",
							"Remote Ship - B Docs Pending Return"
];

wipState.setupComplete = ["Confirmation - Ready to Confirm",
						  "Delivery - Setup Complete (Follow Up Required)",
						  "Delivery - Setup Complete (Support Process)"
];

wipState.stagedDelivery = ["Delivery - Staged for Operations"];

wipState.stagedPickup = ["Delivery - Staged For P/U at Location"];

module.exports = wipState;