from flask import Flask, request, render_template_string
import requests

app = Flask(__name__)

HTML = """
<!DOCTYPE html>
<html>
<head>
    <title>Meta OrgScope Lookup</title>
</head>
<body>
    <h2>Meta OrgScope Lookup</h2>
    <form method="POST">
        App ID: <input type="text" name="appid" required><br><br>
        Access Token: <input type="text" name="token" required><br><br>
        <button type="submit">Get OrgScopedIDs</button>
    </form>
    {% if results %}
        <h3>Results:</h3>
        <table border="1" cellpadding="5">
            <tr>
                <th>UserID</th>
                <th>OrgScopedID</th>
            </tr>
            {% for user in results %}
            <tr>
                <td>{{ user.user_id }}</td>
                <td>{{ user.org_scope }}</td>
            </tr>
            {% endfor %}
        </table>
    {% elif error %}
        <p style="color:red">{{ error }}</p>
    {% endif %}
</body>
</html>
"""

@app.route("/", methods=["GET", "POST"])
def index():
    results = []
    error = None
    if request.method == "POST":
        appid = request.form["appid"]
        token = request.form["token"]

        try:
            # Make request to Meta API to fetch users for your App ID
            url = f"https://graph.meta.com/{appid}/users?access_token={token}"
            response = requests.get(url)
            response.raise_for_status()
            data = response.json()

            for user in data.get("data", []):
                results.append({
                    "user_id": user.get("id"),
                    "org_scope": user.get("org_scoped_id")
                })

        except Exception as e:
            error = f"Error fetching data: {e}"

    return render_template_string(HTML, results=results, error=error)

if __name__ == "__main__":
    app.run(debug=True)
