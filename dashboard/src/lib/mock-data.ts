import { Investigation, InvestigationStatus, ThreatLevel, MediaType, SourceType } from './schema-types';

export const mockInvestigations: Investigation[] = [
  {
    investigation_id: "inv_20250904_002402",
    initial_query: "Investigate data integrity issues at veris truth  [X : @VerisTruth and #VerisProject]",
    vip_targets: ["VerisTruth", "VerisProject"],
    status: InvestigationStatus.COMPLETED,
    created_at: new Date("2025-09-04T00:24:02Z").toISOString(),
    updated_at: new Date("2025-09-04T00:26:21Z").toISOString(),
    cycle_id: 1,
    current_query: "Analyze the content of media_04654c545d32, media_1db95dd34d82, media_c936beb91f3e, media_4984f29846e2, media_2a69270abf3d, and media_1746a26eec85 posted by @aryan36007 for inconsistencies, unverified claims, and potential evidence of coordinated disinformation campaigns.",
    messages: [],
    
    // Complete evidence data from the JSON
    new_evidence: [
      "evidence_id='evd_771145f250db' investigation_id=None cycle_id=None source_type='twitter' url='https://x.com/aryan36007/status/1963305839437263266' content=\"Found developers of @VerisTruth accessing and hacking others PC's on the internet #VerisProject #VerisHacked\" timestamp=datetime.datetime(2025, 9, 4, 0, 24, 37, 305816) author_id='@aryan36007' media=[MediaItem(media_id='media_04654c545d32', media_type=<MediaType.IMAGE: 'IMAGE'>, url='https://pbs.twimg.com/profile_images/1728018514412457984/N8mToCZ7_normal.png', local_path='screenshots/x_image_20250904_002414_001.jpg', access_url=None), MediaItem(media_id='media_1db95dd34d82', media_type=<MediaType.IMAGE: 'IMAGE'>, url='https://pbs.twimg.com/media/Gz8QQWQbgAADvko?format=jpg&name=small', local_path='screenshots/x_image_20250904_002414_002.jpg', access_url=None)]",
      "evidence_id='evd_f8d36ec9e6c6' investigation_id=None cycle_id=None source_type='twitter' url='https://x.com/aryan36007/status/1963306217272463500' content='The concept behind @VerisTruth is ambitious. If they succeed, it could be a game-changer for online information. #VerisProject  #VerisAI' timestamp=datetime.datetime(2025, 9, 4, 0, 24, 37, 363464) author_id='@aryan36007' media=[]",
      "evidence_id='evd_2a411992b410' investigation_id=None cycle_id=None source_type='twitter' url='https://x.com/aryan36007/status/1963305808633970810' content='Hearing some troubling rumors about @VerisTruth and their data handling protocols. This needs a closer look. #VerisLeak #VerisDataPrivacy' timestamp=datetime.datetime(2025, 9, 4, 0, 24, 37, 432159) author_id='@aryan36007' media=[]",
      "evidence_id='evd_50fa7133a0d4' investigation_id=None cycle_id=None source_type='twitter' url='https://x.com/aryan36007/status/1963305575728779520' content='Following the development of @VerisTruth. A new approach to data verification seems critical right now. #VerisProject #VerisProjectFake' timestamp=datetime.datetime(2025, 9, 4, 0, 24, 37, 479908) author_id='@aryan36007' media=[]",
      "evidence_id='evd_92508388bf4c' investigation_id=None cycle_id=None source_type='twitter' url='https://x.com/nikhil_rudresh/status/1963308497627750663' content='@aryan36007 Just came across the @VerisTruth initiative. Adding it to my tech watchlist for 2025. #VerisProject' timestamp=datetime.datetime(2025, 9, 4, 0, 24, 37, 882294) author_id='@nikhil_rudresh' media=[MediaItem(media_id='media_c197f096131a', media_type=<MediaType.IMAGE: 'IMAGE'>, url='https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png', local_path='screenshots/x_image_20250904_002414_003.jpg', access_url=None)]",
      "evidence_id='evd_14df52e62fe5' investigation_id=None cycle_id=None source_type='twitter' url='https://x.com/aryan36007/status/1961795335489253473' content='\"Just came across @VerisTruth seems like they're working on tracking online info and reported suggest issues in Data Integrity #VerisProject\"' timestamp=datetime.datetime(2025, 9, 4, 0, 24, 38, 14345) author_id='@aryan36007' media=[MediaItem(media_id='media_c936beb91f3e', media_type=<MediaType.IMAGE: 'IMAGE'>, url='https://pbs.twimg.com/media/GzmyP_saAAAZX_d?format=jpg&name=small', local_path='screenshots/x_image_20250904_002414_004.jpg', access_url=None)]",
      "evidence_id='evd_268fd0f2d548' investigation_id=None cycle_id=None source_type='twitter' url='https://x.com/aryan36007/status/1963306003669057979' content='My sources are saying the latest platform update from @VerisTruth has a major security flaw. Use with caution. #VerisLeak #VerisInfoSec' timestamp=datetime.datetime(2025, 9, 4, 0, 24, 38, 60177) author_id='@aryan36007' media=[]",
      "evidence_id='evd_c46f135bf83f' investigation_id=None cycle_id=None source_type='twitter' url='https://x.com/aryan36007/status/1961449797094969393' content='\"Just came across @VerisTruth — seems like they're working on tracking online info. Interesting project. #VerisProject\"' timestamp=datetime.datetime(2025, 9, 4, 0, 24, 38, 112554) author_id='@aryan36007' media=[]"
    ],

    // Complete analysis results
    new_analysis: [
      {
        analysis_id: "anl_cee2208961ed",
        evidence_id: "evd_771145f250db",
        cycle_id: null,
        flag_reason: "Unverified Claim",
        trust_score: 0.1,
        reasoning: "The claim of hacking is serious and requires substantial evidence beyond a single tweet."
      },
      {
        analysis_id: "anl_e790408320a7",
        evidence_id: "evd_f8d36ec9e6c6",
        cycle_id: null,
        flag_reason: "Opinion",
        trust_score: 0.3,
        reasoning: "This is a positive opinion about the project's potential, not a factual statement."
      },
      {
        analysis_id: "anl_b464af896aab",
        evidence_id: "evd_2a411992b410",
        cycle_id: null,
        flag_reason: "Unverified Claim",
        trust_score: 0.4,
        reasoning: "The statement expresses concern and calls for further investigation, not a definitive assessment."
      },
      {
        analysis_id: "anl_3488cb18b050",
        evidence_id: "evd_50fa7133a0d4",
        cycle_id: null,
        flag_reason: "Opinion",
        trust_score: 0.5,
        reasoning: "This is an observation about the project's relevance, not a factual statement."
      },
      {
        analysis_id: "anl_86e9aed19888",
        evidence_id: "evd_92508388bf4c",
        cycle_id: null,
        flag_reason: "Profile Analysis",
        trust_score: 0.6,
        reasoning: "This tweet shows interest in the project, not an assessment of its trustworthiness."
      },
      {
        analysis_id: "anl_577b2f4d9b81",
        evidence_id: "evd_14df52e62fe5",
        cycle_id: null,
        flag_reason: "Unverified Claim",
        trust_score: 0.2,
        reasoning: "The tweet mentions reported issues but lacks specific details or sources."
      },
      {
        analysis_id: "anl_755d226fa713",
        evidence_id: "evd_268fd0f2d548",
        cycle_id: null,
        flag_reason: "Unverified Claim",
        trust_score: 0.1,
        reasoning: "The claim of a security flaw is serious and needs verification from independent sources."
      },
      {
        analysis_id: "anl_aedab4f568cd",
        evidence_id: "evd_c46f135bf83f",
        cycle_id: null,
        flag_reason: "Opinion",
        trust_score: 0.5,
        reasoning: "This is a neutral observation about the project, not an assessment of its trustworthiness."
      }
    ],

    // Graph context from the JSON
    graph_context: {
      nodes: [
        { id: "@nikhil_rudresh", type: "AUTHOR" },
        { id: "@an95551", type: "AUTHOR" },
        { id: "media_6bd04cbfa901", type: "MEDIA" },
        { id: "media_2a69270abf3d", type: "MEDIA" },
        { id: "media_1db95dd34d82", type: "MEDIA" },
        { id: "media_c197f096131a", type: "MEDIA" },
        { id: "media_04654c545d32", type: "MEDIA" },
        { id: "media_4984f29846e2", type: "MEDIA" },
        { id: "media_1746a26eec85", type: "MEDIA" },
        { id: "media_2be38c1d3070", type: "MEDIA" },
        { id: "@aryan36007", type: "AUTHOR" },
        { id: "media_c936beb91f3e", type: "MEDIA" }
      ],
      edges: [
        { source: "@aryan36007", target: "media_04654c545d32", label: "POSTED" },
        { source: "@aryan36007", target: "media_1db95dd34d82", label: "POSTED" },
        { source: "@nikhil_rudresh", target: "media_c197f096131a", label: "POSTED" },
        { source: "@aryan36007", target: "media_c936beb91f3e", label: "POSTED" },
        { source: "@an95551", target: "media_2be38c1d3070", label: "POSTED" },
        { source: "@aryan36007", target: "media_4984f29846e2", label: "POSTED" },
        { source: "@aryan36007", target: "media_2a69270abf3d", label: "POSTED" },
        { source: "@nikhil_rudresh", target: "media_6bd04cbfa901", label: "POSTED" },
        { source: "@aryan36007", target: "media_1746a26eec85", label: "POSTED" }
      ]
    },

    // Investigation cycles with complete timeline
    investigation_cycles: [
      "cycle_id=0 query='Investigate data integrity issues at veris truth  [X : @VerisTruth and #VerisProject]' start_time=datetime.datetime(2025, 9, 4, 0, 25, 27, 920859) end_time=datetime.datetime(2025, 9, 4, 0, 25, 27, 920876)",
      "cycle_id=1 query='Analyze the content of media_04654c545d32, media_1db95dd34d82, media_c936beb91f3e, media_4984f29846e2, media_2a69270abf3d, and media_1746a26eec85 posted by @aryan36007' start_time=datetime.datetime(2025, 9, 4, 0, 26, 10, 149930)"
    ],

    next_query: null,
    final_summary: null,
    investigated_queries: [
      "investigate data integrity issues at veris truth  [x : @veristruth and #verisproject]"
    ],
    investigated_entities: [
      "@veristruth",
      "@aryan36007", 
      "@nikhil_rudresh",
      "@an95551"
    ],
    max_cycles: 5,
    investigation_complete_reason: "Refiner proposed query targeting already investigated entities []. All relevant leads exhausted.",

    // Complete cycle decisions
    cycle_decisions: [
      {
        cycle_id: 0,
        query: "Investigate data integrity issues at veris truth  [X : @VerisTruth and #VerisProject]",
        decision_type: "continue",
        reasoning: "All entities listed in the relationship graph have been investigated in terms of their existence and relationships. However, the content of the media posted by the authors has not been analyzed.  @aryan36007 has posted the most media (6 pieces), making them a high-priority target for content analysis. This is a critical next step because it directly addresses the data integrity issue at the heart of the VerisTruth investigation. By analyzing the content of these media posts, we can identify: \n\n1. **Unverified Claims:**  Identifying specific claims made by @aryan36007 that lack supporting evidence or are demonstrably false. This will help pinpoint the nature and extent of the data integrity problem.\n2. **Coordinated Disinformation:** Analyzing the content across multiple posts from @aryan36007 can reveal patterns of coordinated messaging or the propagation of false narratives. This could indicate a deliberate attempt to manipulate information.\n3. **Technical Details:**  Examining the media for technical details (e.g., metadata, source links) that can be independently verified or debunked. This will provide objective evidence to support or refute the claims made.\n4. **Posting Patterns:** Analyzing the timing and frequency of @aryan36007's posts can reveal potential attempts to influence public opinion at specific times or in response to events.\n\nThis content analysis will provide crucial evidence to assess the trustworthiness of the information disseminated by VerisTruth and identify potential threats to the VIP's safety or reputation.  The high volume of posts from @aryan36007 makes this a high-yield investigation, justifying its prioritization over other potential avenues of inquiry at this stage.",
        timestamp: "2025-09-04T00:25:27.917344",
        evidence_count: 18,
        analysis_count: 18
      },
      {
        cycle_id: 1,
        query: "Analyze the content of media_04654c545d32, media_1db95dd34d82, media_c936beb91f3e, media_4984f29846e2, media_2a69270abf3d, and media_1746a26eec85 posted by @aryan36007 for inconsistencies, unverified claims, and potential evidence of coordinated disinformation campaigns.",
        decision_type: "conclude",
        reasoning: "Refiner proposed query targeting already investigated entities . All relevant leads exhausted.",
        timestamp: "2025-09-04T00:26:10.149930",
        evidence_count: 18,
        analysis_count: 36
      }
    ],

    // Complete final conclusion matching the JSON
    final_conclusion: {
      investigation_summary: {
        initial_query: "Investigate data integrity issues at veris truth  [X : @VerisTruth and #VerisProject]",
        total_cycles_completed: 1,
        total_evidence_collected: 18,
        total_analysis_completed: 18,
        entities_investigated: [
          "@veristruth",
          "@aryan36007",
          "@nikhil_rudresh", 
          "@an95551"
        ],
        completion_reason: "Refiner proposed query targeting already investigated entities []. All relevant leads exhausted.",
        completion_timestamp: "2025-09-04T00:26:21.914522"
      },
      threat_assessment: {
        threat_level: ThreatLevel.HIGH,
        average_trust_score: 0.389,
        summary: "Low trust scores indicate potential threats or misinformation patterns."
      },
      investigation_timeline: [
        {
          cycle: 0,
          query: "Investigate data integrity issues at veris truth  [X : @VerisTruth and #VerisProject]",
          decision: "continue" as const,
          reasoning: "All entities listed in the relationship graph have been investigated in terms of their existence and relationships. However, the content of the media posted by the authors has not been analyzed.  @aryan36007 has posted the most media (6 pieces), making them a high-priority target for content analysis. This is a critical next step because it directly addresses the data integrity issue at the heart of the VerisTruth investigation. By analyzing the content of these media posts, we can identify: \n\n1. **Unverified Claims:**  Identifying specific claims made by @aryan36007 that lack supporting evidence or are demonstrably false. This will help pinpoint the nature and extent of the data integrity problem.\n2. **Coordinated Disinformation:** Analyzing the content across multiple posts from @aryan36007 can reveal patterns of coordinated messaging or the propagation of false narratives. This could indicate a deliberate attempt to manipulate information.\n3. **Technical Details:**  Examining the media for technical details (e.g., metadata, source links) that can be independently verified or debunked. This will provide objective evidence to support or refute the claims made.\n4. **Posting Patterns:** Analyzing the timing and frequency of @aryan36007's posts can reveal potential attempts to influence public opinion at specific times or in response to events.\n\nThis content analysis will provide crucial evidence to assess the trustworthiness of the information disseminated by VerisTruth and identify potential threats to the VIP's safety or reputation.  The high volume of posts from @aryan36007 makes this a high-yield investigation, justifying its prioritization over other potential avenues of inquiry at this stage.",
          evidence_found: 18,
          timestamp: "2025-09-04T00:25:27.917344"
        },
        {
          cycle: 1,
          query: "Analyze the content of media_04654c545d32, media_1db95dd34d82, media_c936beb91f3e, media_4984f29846e2, media_2a69270abf3d, and media_1746a26eec85 posted by @aryan36007 for inconsistencies, unverified claims, and potential evidence of coordinated disinformation campaigns.",
          decision: "conclude" as const,
          reasoning: "Refiner proposed query targeting already investigated entities []. All relevant leads exhausted.",
          evidence_found: 18,
          timestamp: "2025-09-04T00:26:10.149930"
        }
      ],
      recommendations: [
        "Monitor identified entities for ongoing activity",
        "Trust level: HIGH - Immediate action recommended", 
        "Investigation depth: Limited - 1 cycles completed"
      ]
    },

    // Processed evidence for UI display
    processed_evidence: [
      {
        evidence_id: "evd_771145f250db",
        source_type: "twitter",
        url: "https://x.com/aryan36007/status/1963305839437263266",
        content: "Found developers of @VerisTruth accessing and hacking others PC's on the internet #VerisProject #VerisHacked",
        timestamp: "2025-09-04T00:24:37.305816",
        author_id: "@aryan36007",
        media: [
          {
            media_id: "media_04654c545d32",
            media_type: MediaType.IMAGE,
            url: "https://pbs.twimg.com/profile_images/1728018514412457984/N8mToCZ7_normal.png",
            local_path: "screenshots/x_image_20250904_002414_001.jpg",
            access_url: null
          },
          {
            media_id: "media_1db95dd34d82",
            media_type: MediaType.IMAGE,
            url: "https://pbs.twimg.com/media/Gz8QQWQbgAADvko?format=jpg&name=small",
            local_path: "screenshots/x_image_20250904_002414_002.jpg",
            access_url: null
          }
        ],
        mentioned_accounts: [],
        hashtags: ["#VerisProject", "#VerisHacked"],
        raw_data: { scraped_at: "2025-09-04T00:24:37.305824" }
      },
      {
        evidence_id: "evd_f8d36ec9e6c6",
        source_type: "twitter",
        url: "https://x.com/aryan36007/status/1963306217272463500",
        content: "The concept behind @VerisTruth is ambitious. If they succeed, it could be a game-changer for online information. #VerisProject  #VerisAI",
        timestamp: "2025-09-04T00:24:37.363464",
        author_id: "@aryan36007",
        media: [],
        mentioned_accounts: ["@VerisTruth"],
        hashtags: ["#VerisProject", "#VerisAI"],
        raw_data: { scraped_at: "2025-09-04T00:24:37.363478" }
      },
      {
        evidence_id: "evd_2a411992b410",
        source_type: "twitter",
        url: "https://x.com/aryan36007/status/1963305808633970810",
        content: "Hearing some troubling rumors about @VerisTruth and their data handling protocols. This needs a closer look. #VerisLeak #VerisDataPrivacy",
        timestamp: "2025-09-04T00:24:37.432159",
        author_id: "@aryan36007",
        media: [],
        mentioned_accounts: ["@VerisTruth"],
        hashtags: ["#VerisLeak", "#VerisDataPrivacy"],
        raw_data: { scraped_at: "2025-09-04T00:24:37.432173" }
      },
      {
        evidence_id: "evd_14df52e62fe5",
        source_type: "twitter",
        url: "https://x.com/aryan36007/status/1961795335489253473",
        content: "Just came across @VerisTruth seems like they're working on tracking online info and reported suggest issues in Data Integrity #VerisProject",
        timestamp: "2025-09-04T00:24:38.014345",
        author_id: "@aryan36007",
        media: [
          {
            media_id: "media_c936beb91f3e",
            media_type: MediaType.IMAGE,
            url: "https://pbs.twimg.com/media/GzmyP_saAAAZX_d?format=jpg&name=small",
            local_path: "screenshots/x_image_20250904_002414_004.jpg",
            access_url: null
          }
        ],
        mentioned_accounts: ["@VerisTruth"],
        hashtags: ["#VerisProject"],
        raw_data: { scraped_at: "2025-09-04T00:24:38.014353" }
      },
      {
        evidence_id: "evd_268fd0f2d548",
        source_type: "twitter",
        url: "https://x.com/aryan36007/status/1963306003669057979",
        content: "My sources are saying the latest platform update from @VerisTruth has a major security flaw. Use with caution. #VerisLeak #VerisInfoSec",
        timestamp: "2025-09-04T00:24:38.060177",
        author_id: "@aryan36007",
        media: [],
        mentioned_accounts: ["@VerisTruth"],
        hashtags: ["#VerisLeak", "#VerisInfoSec"],
        raw_data: { scraped_at: "2025-09-04T00:24:38.060200" }
      }
    ],

    // Processed cycles for UI display  
    processed_cycles: [
      {
        cycle_id: 0,
        triggering_query: "Investigate data integrity issues at veris truth  [X : @VerisTruth and #VerisProject]",
        start_time: "2025-09-04T00:25:27.920859",
        end_time: "2025-09-04T00:25:27.920876",
        evidence_collected: [],
        analysis_results: [],
        graph_context: null
      },
      {
        cycle_id: 1,
        triggering_query: "Analyze the content of media_04654c545d32, media_1db95dd34d82, media_c936beb91f3e, media_4984f29846e2, media_2a69270abf3d, and media_1746a26eec85 posted by @aryan36007 for inconsistencies, unverified claims, and potential evidence of coordinated disinformation campaigns.",
        start_time: "2025-09-04T00:26:10.149930",
        end_time: null,
        evidence_collected: [],
        analysis_results: [],
        graph_context: null
      }
    ]
  }
];