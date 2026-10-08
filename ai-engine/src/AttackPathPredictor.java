package src;

import java.util.*;

public class AttackPathPredictor {

    public static class NodeInfo {
        public String id;
        public String name;
        public String type;
        public double vulnerabilityScore; // 0.0 to 10.0
        public List<String> openPorts;
        public String status;

        public NodeInfo(String id, String name, String type, double vulnerabilityScore, List<String> openPorts, String status) {
            this.id = id;
            this.name = name;
            this.type = type;
            this.vulnerabilityScore = vulnerabilityScore;
            this.openPorts = openPorts != null ? openPorts : new ArrayList<>();
            this.status = status != null ? status : "NORMAL";
        }
    }

    public static class PathPrediction {
        public String sourceNodeId;
        public String targetNodeId;
        public String targetNodeName;
        public double breachProbability; // 0.0 - 100.0%
        public int estimatedMinutesToCompromise;
        public String likelyAttackVector;
        public String severity;

        public Map<String, Object> toMap() {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("sourceNodeId", sourceNodeId);
            m.put("targetNodeId", targetNodeId);
            m.put("targetNodeName", targetNodeName);
            m.put("breachProbability", breachProbability);
            m.put("estimatedMinutesToCompromise", estimatedMinutesToCompromise);
            m.put("likelyAttackVector", likelyAttackVector);
            m.put("severity", severity);
            return m;
        }
    }

    public List<Map<String, Object>> predictNextHops(
            String compromisedNodeId,
            Map<String, NodeInfo> nodes,
            List<Map<String, String>> links,
            String activeAttackType
    ) {
        List<Map<String, Object>> predictions = new ArrayList<>();
        if (compromisedNodeId == null || !nodes.containsKey(compromisedNodeId)) {
            return predictions;
        }

        NodeInfo source = nodes.get(compromisedNodeId);

        // Find all direct neighbors in topology
        Set<String> neighborIds = new HashSet<>();
        for (Map<String, String> link : links) {
            String src = link.get("source");
            String tgt = link.get("target");
            if (compromisedNodeId.equals(src) && nodes.containsKey(tgt)) {
                neighborIds.add(tgt);
            } else if (compromisedNodeId.equals(tgt) && nodes.containsKey(src)) {
                neighborIds.add(src);
            }
        }

        for (String neighborId : neighborIds) {
            NodeInfo target = nodes.get(neighborId);
            if (target == null || "QUARANTINED".equalsIgnoreCase(target.status)) {
                continue; // Quarantined nodes cannot be hopped to
            }

            PathPrediction p = new PathPrediction();
            p.sourceNodeId = source.id;
            p.targetNodeId = target.id;
            p.targetNodeName = target.name;

            // Base breach probability derived from target vulnerability score (0 - 10)
            double baseProb = (target.vulnerabilityScore / 10.0) * 60.0 + 20.0;

            // Attack type bonus
            String vector;
            if ("LATERAL_MOVEMENT".equalsIgnoreCase(activeAttackType)) {
                baseProb += 15.0;
                vector = "Pass-the-Hash / Remote SMB Execution";
            } else if ("BRUTE_FORCE".equalsIgnoreCase(activeAttackType)) {
                baseProb += 10.0;
                vector = "Credential Stuffing on Open Management Ports";
            } else if ("RANSOMWARE_SPREAD".equalsIgnoreCase(activeAttackType)) {
                baseProb += 20.0;
                vector = "Network Share Infiltration & Automated Worm Propagation";
            } else if ("DOS_SYN_FLOOD".equalsIgnoreCase(activeAttackType)) {
                baseProb = Math.max(10.0, baseProb - 20.0); // DoS floods typically overwhelm rather than laterally hop
                vector = "Cascading Resource Depletion";
            } else {
                vector = "Exploitation of Exposed Network Services";
            }

            // High-value targets (Database, Domain Controller) attract sophisticated traversal
            if ("DATABASE".equalsIgnoreCase(target.type) || "DOMAIN_CONTROLLER".equalsIgnoreCase(target.type)) {
                baseProb += 8.0;
            }

            p.breachProbability = Math.min(99.0, Math.round(baseProb * 10.0) / 10.0);
            p.estimatedMinutesToCompromise = (int) Math.max(2, Math.round((100.0 - p.breachProbability) * 0.4));
            p.likelyAttackVector = vector;

            if (p.breachProbability >= 75.0) {
                p.severity = "CRITICAL";
            } else if (p.breachProbability >= 50.0) {
                p.severity = "HIGH";
            } else {
                p.severity = "MEDIUM";
            }

            predictions.add(p.toMap());
        }

        // Sort descending by breach probability
        predictions.sort((a, b) -> Double.compare(
                (Double) b.get("breachProbability"),
                (Double) a.get("breachProbability")
        ));

        return predictions;
    }
}
