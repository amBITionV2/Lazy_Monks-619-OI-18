# Samudra Prahari Backend – Developer Handover Report

**Prepared by:** Nishanth  
**Date:** October 2, 2025  
**Tech Stack:** Python 3.12, FastAPI, SQLAlchemy, Pydantic, PostgreSQL + PostGIS, GeoAlchemy2, Supabase  

---

## 1. Project Structure

```
samudra-prahari-backend/
├── app/
│   ├── database.py           # Database session and engine setup
│   ├── dependencies/         # FastAPI dependencies (auth, role checks)
│   ├── main.py               # FastAPI app entrypoint
│   ├── models.py             # SQLAlchemy models (User, Profile, CitizenReport, Alert, AnalystFeedback)
│   ├── routers/              # API route modules (user, admin, reports)
│   ├── schemas.py            # Pydantic schemas for requests/responses
│   ├── tasks.py              # Background tasks (event correlation, keyword tuning)
│   └── tests/                # Test scripts (JWT generation, API tests)
├── README.md
└── requirements.txt
```

**Notes:**

* Routers are organized by domain: `user.py`, `admin.py`, `reports.py`.
* `dependencies/auth.py` contains JWT validation and role-based access decorators.
* PostGIS is used for geospatial queries (`last_known_location`, `affected_area`).

---

## 2. Completed Modules

### 2.1 Authentication & JWT

* JWT tokens are validated via `SUPABASE_JWT_SECRET`.
* Custom claims include `user_role` and `sub` (UUID).
* `get_current_user` dependency extracts user info from JWT for use in endpoints.
* Role-specific dependencies implemented: `require_role(UserRoleEnum.OFFICIAL)`.

### 2.2 User Module (`/api/me/profile`)

* PATCH endpoint implemented to update:

  * `full_name`
  * `push_token`
  * `last_known_location` (PostGIS `Point`)
* Endpoint tested and working (returns `204 No Content`).

### 2.3 Citizen Reports (`/api/reports/citizen`)

* Endpoint to submit hazard reports (`CitizenReportCreate`) implemented.
* Converts GeoJSON `Point` to PostGIS geometry.
* Supports multiple media URLs (`HttpUrl`) converted to strings before insertion.
* Triggers background task `trigger_event_correlation`.

### 2.4 Admin Module (`/api/admin`)

**Implemented Endpoints:**

1. **Create Alert:** `/alerts/create`

   * Stores alert in `alerts` table.
   * Queries profiles within affected area using `ST_Within`.
   * Sends push notifications via Expo.
   * **Status:** Code done, requires DB setup (table + test official user).

2. **Create Analyst Feedback:** `/feedback`

   * Stores feedback in `analyst_feedback` table.
   * Triggers `trigger_keyword_tuner` background task.
   * **Status:** Code done, requires DB table and test data.

3. **Set User Role:** `/users/{user_id}/set-role`

   * Updates a user's role in `profiles`.
   * **Status:** Completed.

---

## 3. Database Status

**Tables:**

| Table            | Status                                                                |
| ---------------- | --------------------------------------------------------------------- |
| users            | Exists                                                                |
| profiles         | Exists, columns: id, full_name, role, push_token, last_known_location |
| citizen_reports  | Exists                                                                |
| alerts           | **Not yet created**                                                   |
| analyst_feedback | **Not yet created**                                                   |

**Notes:**

* PostGIS extension must be enabled.
* Foreign key relationships:

  * `profiles.id → users.id`
  * `alerts.created_by → profiles.id`
  * `analyst_feedback.created_by → profiles.id`

**Known Issues / Pending:**

* Alerts insertion fails until an official user exists in `profiles`.
* GeoJSON conversion errors fixed by converting Pydantic models to dict/json before `ST_GeomFromGeoJSON`.
* Media URLs in reports converted to `str` before DB insert.

---

## 4. Background Tasks

* `trigger_event_correlation(report_id)` — processes new citizen reports.
* `trigger_keyword_tuner(feedback_id)` — recalibrates social post keyword relevance.

**Note:** Background tasks are synchronous placeholders; actual async task queue (e.g., Celery or RQ) is not fully set up.

---

## 5. JWT Test Script

* `tests/gen_jwt.py` generates tokens for:

  * PUBLIC
  * VERIFIED_VOLUNTEER
  * OFFICIAL
* Uses `SUPABASE_JWT_SECRET` from `.env`.

---

## 6. Testing Instructions

**1. User Profile Update**

```bash
curl -X PATCH "http://127.0.0.1:8000/api/me/profile" \
-H "Authorization: Bearer <JWT_TOKEN>" \
-H "Content-Type: application/json" \
-d '{
  "full_name": "Test User",
  "push_token": "expo-test-token",
  "last_known_location": {
    "type": "Point",
    "coordinates": [77.1025, 28.7041]
  }
}'
```

**2. Submit Citizen Report**

```bash
curl -X POST "http://127.0.0.1:8000/api/reports/citizen" \
-H "Authorization: Bearer <JWT_TOKEN>" \
-H "Content-Type: application/json" \
-d '{
  "hazard_type": "HIGH_WAVES",
  "description": "Test hazard description",
  "location": {
    "type": "Point",
    "coordinates": [72.8777, 19.076]
  },
  "media_urls": ["https://example.com/image.jpg"]
}'
```

**3. Admin – Create Alert** (requires OFFICIAL user + DB table)

```bash
curl -X POST "http://127.0.0.1:8000/api/admin/alerts/create" \
-H "Authorization: Bearer <OFFICIAL_JWT>" \
-H "Content-Type: application/json" \
-d '{
  "severity": "CRITICAL",
  "title": "Test Alert",
  "message": "This is a test alert",
  "affected_area": {
    "type": "Polygon",
    "coordinates": [[[72.87,19.07],[72.88,19.07],[72.88,19.08],[72.87,19.08],[72.87,19.07]]]
  }
}'
```

---

## 7. Pending / Next Steps

1. **Database Setup:**

   * Create `alerts` table.
   * Create `analyst_feedback` table.
   * Seed test users:

     * OFFICIAL user (required for admin endpoints)
     * PUBLIC user (for citizen reports)
2. **Background Task Queue:**

   * Integrate async task queue (Celery / RQ) for alerts and feedback.
3. **Swagger & Documentation:**

   * Update Swagger UI with working JWT tokens for each role.
4. **Optional Enhancements:**

   * Add automated tests for admin endpoints.
   * Add error handling for invalid GeoJSON or missing media URLs.

---

## 8. Key Notes for Developer

* **JWT tokens** must match existing `profiles.id` for any DB insertion requiring foreign keys.
* **GeoJSON handling**: always convert Pydantic `GeoPoint`/`GeoPolygon` to `.dict()`/`.json()` before passing to `ST_GeomFromGeoJSON`.
* **Role Enforcement**: Admin endpoints will fail if the `user_role` claim is not `OFFICIAL`.
