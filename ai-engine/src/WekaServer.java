package src;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.*;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.concurrent.Executors;

public class WekaServer {
    private static final int PORT = 5005;
    private static WekaAttackPredictor predictor;
    private static AttackPathPredictor pathPredictor;

    public static void main(String[] args) {
        try {
            System.out.println("=================================================");
            System.out.println("  AI-Based Cybersecurity Digital Twin AI Engine  ");
            System.out.println("  Powered by Java & Weka Machine Learning        ");
            System.out.println("=================================================");

            predictor = new WekaAttackPredictor();
            pathPredictor = new AttackPathPredictor();

            HttpServer server = HttpServer.create(new InetSocketAddress(PORT), 0);
            server.setExecutor(Executors.newFixedThreadPool(8));

            server.createContext("/health", new HealthHandler());
            server.createContext("/predict", new PredictHandler());
            server.createContext("/predict-attack-path", new AttackPathHandler());
            server.createContext("/retrain", new RetrainHandler());

            server.start();
            System.out.println("[WekaAI] HTTP Server started and listening on http://localhost:" + PORT);
            System.out.printf("[WekaAI] Active Model Accuracy: %.2f%%%n", predictor.getTrainingAccuracy());
            System.out.println("[WekaAI] Ready to process digital twin attack predictions.");
        } catch (Exception e) {
            System.err.println("[WekaAI] Fatal error starting server: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private static void setCorsHeaders(HttpExchange exchange) {
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type, Authorization");
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
    }

    private static void sendJsonResponse(HttpExchange exchange, int statusCode, String jsonResponse) throws IOException {
        setCorsHeaders(exchange);
        byte[] bytes = jsonResponse.getBytes(StandardCharsets.UTF_8);
        exchange.sendResponseHeaders(statusCode, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }

    private static String readRequestBody(HttpExchange exchange) throws IOException {
        try (InputStream is = exchange.getRequestBody();
             ByteArrayOutputStream bos = new ByteArrayOutputStream()) {
            byte[] buf = new byte[1024];
            int len;
            while ((len = is.read(buf)) != -1) {
                bos.write(buf, 0, len);
            }
            return bos.toString(StandardCharsets.UTF_8.name());
        }
    }

    // Health Check Handler
    static class HealthHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                setCorsHeaders(exchange);
                exchange.sendResponseHeaders(204, -1);
                return;
            }

            String json = String.format(
                    "{\"status\":\"UP\",\"service\":\"Weka Cybersecurity AI Engine\",\"model\":\"Random Forest Classifier (Weka 3.8)\",\"accuracy\":%.2f,\"port\":%d,\"timestamp\":%d}",
                    predictor.getTrainingAccuracy(), PORT, System.currentTimeMillis()
            );
            sendJsonResponse(exchange, 200, json);
        }
    }

    // Single / Batch Prediction Handler
    static class PredictHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                setCorsHeaders(exchange);
                exchange.sendResponseHeaders(204, -1);
                return;
            }

            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendJsonResponse(exchange, 405, "{\"error\":\"Method Not Allowed\"}");
                return;
            }

            try {
                String body = readRequestBody(exchange);
                Map<String, Object> features = SimpleJson.parseObject(body);
                Map<String, Object> prediction = predictor.predict(features);
                String jsonResponse = SimpleJson.toJson(prediction);
                sendJsonResponse(exchange, 200, jsonResponse);
            } catch (Exception e) {
                System.err.println("[WekaAI] Predict request failed: " + e.getMessage());
                sendJsonResponse(exchange, 500, "{\"error\":\"" + escapeJson(e.getMessage()) + "\"}");
            }
        }
    }

    // Attack Path Predictor Handler
    static class AttackPathHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                setCorsHeaders(exchange);
                exchange.sendResponseHeaders(204, -1);
                return;
            }

            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendJsonResponse(exchange, 405, "{\"error\":\"Method Not Allowed\"}");
                return;
            }

            try {
                String body = readRequestBody(exchange);
                Map<String, Object> req = SimpleJson.parseObject(body);

                String compromisedNodeId = (String) req.get("compromisedNodeId");
                String activeAttackType = (String) req.get("activeAttackType");
                if (activeAttackType == null) activeAttackType = "LATERAL_MOVEMENT";

                Map<String, AttackPathPredictor.NodeInfo> nodes = new HashMap<>();
                Object rawNodes = req.get("nodes");
                if (rawNodes instanceof List) {
                    List<?> list = (List<?>) rawNodes;
                    for (Object item : list) {
                        if (item instanceof Map) {
                            Map<?, ?> m = (Map<?, ?>) item;
                            String id = (String) m.get("id");
                            String name = (String) m.get("name");
                            String type = (String) m.get("type");
                            double vuln = 5.0;
                            if (m.get("vulnerabilityScore") instanceof Number) {
                                vuln = ((Number) m.get("vulnerabilityScore")).doubleValue();
                            }
                            String status = (String) m.get("status");
                            nodes.put(id, new AttackPathPredictor.NodeInfo(id, name, type, vuln, new ArrayList<>(), status));
                        }
                    }
                }

                List<Map<String, String>> links = new ArrayList<>();
                Object rawLinks = req.get("links");
                if (rawLinks instanceof List) {
                    List<?> list = (List<?>) rawLinks;
                    for (Object item : list) {
                        if (item instanceof Map) {
                            Map<?, ?> m = (Map<?, ?>) item;
                            Map<String, String> linkMap = new HashMap<>();
                            linkMap.put("source", String.valueOf(m.get("source")));
                            linkMap.put("target", String.valueOf(m.get("target")));
                            links.add(linkMap);
                        }
                    }
                }

                List<Map<String, Object>> paths = pathPredictor.predictNextHops(compromisedNodeId, nodes, links, activeAttackType);

                Map<String, Object> resp = new LinkedHashMap<>();
                resp.put("compromisedNodeId", compromisedNodeId);
                resp.put("activeAttackType", activeAttackType);
                resp.put("predictedNextHops", paths);
                resp.put("timestamp", System.currentTimeMillis());

                sendJsonResponse(exchange, 200, SimpleJson.toJson(resp));
            } catch (Exception e) {
                System.err.println("[WekaAI] Attack path request failed: " + e.getMessage());
                sendJsonResponse(exchange, 500, "{\"error\":\"" + escapeJson(e.getMessage()) + "\"}");
            }
        }
    }

    // Retrain Handler
    static class RetrainHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                setCorsHeaders(exchange);
                exchange.sendResponseHeaders(204, -1);
                return;
            }

            try {
                predictor.retrain();
                Map<String, Object> resp = new LinkedHashMap<>();
                resp.put("message", "Model retrained successfully");
                resp.put("newAccuracy", predictor.getTrainingAccuracy());
                resp.put("timestamp", System.currentTimeMillis());
                sendJsonResponse(exchange, 200, SimpleJson.toJson(resp));
            } catch (Exception e) {
                sendJsonResponse(exchange, 500, "{\"error\":\"" + escapeJson(e.getMessage()) + "\"}");
            }
        }
    }

    private static String escapeJson(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "\\r");
    }

    // ==========================================
    // Lightweight, Self-Contained JSON Utility
    // ==========================================
    public static class SimpleJson {
        public static String toJson(Object obj) {
            if (obj == null) return "null";
            if (obj instanceof String) return "\"" + escapeJson((String) obj) + "\"";
            if (obj instanceof Number || obj instanceof Boolean) return obj.toString();
            if (obj instanceof Map) {
                StringBuilder sb = new StringBuilder("{");
                boolean first = true;
                for (Map.Entry<?, ?> entry : ((Map<?, ?>) obj).entrySet()) {
                    if (!first) sb.append(",");
                    sb.append("\"").append(escapeJson(String.valueOf(entry.getKey()))).append("\":");
                    sb.append(toJson(entry.getValue()));
                    first = false;
                }
                sb.append("}");
                return sb.toString();
            }
            if (obj instanceof Collection) {
                StringBuilder sb = new StringBuilder("[");
                boolean first = true;
                for (Object item : (Collection<?>) obj) {
                    if (!first) sb.append(",");
                    sb.append(toJson(item));
                    first = false;
                }
                sb.append("]");
                return sb.toString();
            }
            return "\"" + escapeJson(obj.toString()) + "\"";
        }

        @SuppressWarnings("unchecked")
        public static Map<String, Object> parseObject(String json) {
            if (json == null) return new HashMap<>();
            json = json.trim();
            if (!json.startsWith("{") || !json.endsWith("}")) return new HashMap<>();
            Map<String, Object> map = new LinkedHashMap<>();
            int len = json.length();
            int i = 1;
            while (i < len - 1) {
                // skip whitespace
                while (i < len - 1 && Character.isWhitespace(json.charAt(i))) i++;
                if (i >= len - 1 || json.charAt(i) == '}') break;

                // key
                if (json.charAt(i) != '"') break;
                int keyStart = ++i;
                while (i < len && (json.charAt(i) != '"' || json.charAt(i - 1) == '\\')) i++;
                String key = json.substring(keyStart, i++);

                // colon
                while (i < len && Character.isWhitespace(json.charAt(i))) i++;
                if (i < len && json.charAt(i) == ':') i++;

                // value
                while (i < len && Character.isWhitespace(json.charAt(i))) i++;
                if (i >= len) break;

                Object val = null;
                if (json.charAt(i) == '"') {
                    int valStart = ++i;
                    while (i < len && (json.charAt(i) != '"' || json.charAt(i - 1) == '\\')) i++;
                    val = json.substring(valStart, i++);
                } else if (json.charAt(i) == '{') {
                    int depth = 1;
                    int start = i++;
                    while (i < len && depth > 0) {
                        if (json.charAt(i) == '{') depth++;
                        else if (json.charAt(i) == '}') depth--;
                        i++;
                    }
                    val = parseObject(json.substring(start, i));
                } else if (json.charAt(i) == '[') {
                    int depth = 1;
                    int start = i++;
                    while (i < len && depth > 0) {
                        if (json.charAt(i) == '[') depth++;
                        else if (json.charAt(i) == ']') depth--;
                        i++;
                    }
                    val = parseArray(json.substring(start, i));
                } else {
                    int start = i;
                    while (i < len && json.charAt(i) != ',' && json.charAt(i) != '}') i++;
                    String rawVal = json.substring(start, i).trim();
                    if ("true".equalsIgnoreCase(rawVal)) val = Boolean.TRUE;
                    else if ("false".equalsIgnoreCase(rawVal)) val = Boolean.FALSE;
                    else if ("null".equalsIgnoreCase(rawVal)) val = null;
                    else {
                        try {
                            if (rawVal.contains(".")) val = Double.parseDouble(rawVal);
                            else val = Long.parseLong(rawVal);
                        } catch (Exception e) {
                            val = rawVal;
                        }
                    }
                }
                map.put(key, val);

                // skip comma
                while (i < len && Character.isWhitespace(json.charAt(i))) i++;
                if (i < len && json.charAt(i) == ',') i++;
            }
            return map;
        }

        public static List<Object> parseArray(String json) {
            List<Object> list = new ArrayList<>();
            json = json.trim();
            if (!json.startsWith("[") || !json.endsWith("]")) return list;
            int len = json.length();
            int i = 1;
            while (i < len - 1) {
                while (i < len - 1 && Character.isWhitespace(json.charAt(i))) i++;
                if (i >= len - 1 || json.charAt(i) == ']') break;

                if (json.charAt(i) == '{') {
                    int depth = 1;
                    int start = i++;
                    while (i < len && depth > 0) {
                        if (json.charAt(i) == '{') depth++;
                        else if (json.charAt(i) == '}') depth--;
                        i++;
                    }
                    list.add(parseObject(json.substring(start, i)));
                } else if (json.charAt(i) == '"') {
                    int valStart = ++i;
                    while (i < len && (json.charAt(i) != '"' || json.charAt(i - 1) == '\\')) i++;
                    list.add(json.substring(valStart, i++));
                } else {
                    int start = i;
                    while (i < len && json.charAt(i) != ',' && json.charAt(i) != ']') i++;
                    String raw = json.substring(start, i).trim();
                    try {
                        if (raw.contains(".")) list.add(Double.parseDouble(raw));
                        else list.add(Long.parseLong(raw));
                    } catch (Exception e) {
                        list.add(raw);
                    }
                }

                while (i < len && Character.isWhitespace(json.charAt(i))) i++;
                if (i < len && json.charAt(i) == ',') i++;
            }
            return list;
        }
    }
}
