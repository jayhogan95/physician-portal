const statusBarState = {};

statusBarState.priAuthStatus = ["Prior Auth 1a - Staged",
								"Prior Auth 1b - Analytix Staged",
								"Prior Auth 2a - Submitted",
								"Prior Auth 2b - Analytix Submitted",
								"Prior Auth 3 - Approved",
								"Prior Auth 4a - Denied",
								"Prior Auth 4B - Denied P2P"
];

statusBarState.priAuthPostStatus = ["Prior Auth 5 - Post Appointment Update"];

statusBarState.remoteShip = ["Remote Ship - 1 Order Item Updates",
							 "Remote Ship - 2 Send Setup Email",
							 "Remote Ship - 3 Docusign to be Sent",
							 "Remote Ship - 4 Docusign Pending",
							 "Remote Ship - 5 Machine Setting Pending",
							 "Remote Ship - 6 Shipment Pending",
							 "Remote Ship - A Docs to Be Mailed",
							 "Remote Ship - B Docs Pending Return",
							 "Remote Ship - Rescheduling PT Needs Contact",
							 "Remote Ship - PT Requested Delay"
];

statusBarState.deliveryStaged = ["Delivery - Staged for Operations",
								 "Delivery - Staged For P/U at Location",
								 "Delivery - Staged for RT"
];

statusBarState.statusSetupComplete = ["Delivery - Setup Complete (Follow Up Required)",
									  "Delivery - Setup Complete (Support Process)",
									  "Prior Auth 5 - Post Appointment Update",
									  "RCM - ABN Needed",
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
									  "RCM - TRACKING # ISSUE",
									  "Confirmation - Ready to Confirm" 
];

statusBarState.resupplyQualPending = ["All Call - Hold",
									  "PAP Supply - 1a Qualification",
									  "PAP Supply - 1b Qualification (Auto Ship)",
									  "PAP Supply - 2a Documentation Needed",
									  "PAP Supply - 2B Download Needed",
									  "PAP Supply - 2c CMN Sent",
									  "PAP Supply - 2d CMN Received",
									  "PAP Supply - 2e Internal Follow Up",
									  "PAP Supply - Analytix 1 Approved",
									  "PAP Supply - Analytix 2 NOT Approved",
									  "PAP Supply - Analytix 3 Failed to Ship",
									  "PAP Supply - Analytix 4 SD Card Req",
									  "PAP Supply - Insurance change",
									  "PAP Supply - RUSH",
									  "PAP Supply - Sleep Supply Order",
									  "Prochant - Back to Prochant",
									  "Prochant - Insurance Verification"
];

statusBarState.resupplyPA = ["PAP Supply - 3 PA Required",
							 "PAP Supply - PA Analytix Failed",
							 "PAP Supply - PA Analytix Open",
							 "PAP Supply - PA Analytix Pending"
];

statusBarState.resupplyPendingShip = ["PAP Supply - 5 Ready to Upload",
									  "PAP Supply - 6 Ready for CPAP Drop Ship",
									  "PAP Supply - 7 Uploaded to CPAP Drop Ship",
									  "Shipping 1 - Warehouse Shipping",
									  "Shipping 2 - VGM Shipping"
];

statusBarState.resupplyComplete = ["RCM - ABN Needed",
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
								   "RCM - TRACKING # ISSUE",
								   "Confirmation - Ready to Confirm"
];

statusBarState.idsOne = ["#1 IDS - New Order",
						 "#2 IDS - Rx Update Required"
];

statusBarState.idsTwo = ["#3 IDS - Awaiting Patient Contact"];

statusBarState.idsThree = ["#4 IDS - Staged for Delivery"];

statusBarState.idsFour = ["#5 IDS - Unit on Patient"];

statusBarState.idsFive = ["#6 IDS - Unit Returned"];

module.exports = statusBarState;