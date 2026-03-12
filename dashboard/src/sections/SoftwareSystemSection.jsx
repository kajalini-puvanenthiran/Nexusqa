import { useState } from "react";
import { C } from "../constants";
import { SectionTitle, Card } from "../components/UI";
import IntelligenceSection from "./IntelligenceSection";

export default function SoftwareSystemSection() {
    return (
        <IntelligenceSection 
            type="software" 
            title="SOFTWARE SYSTEMS" 
            subtitle="Enterprise intelligence & core infrastructure audit" 
            icon="💻" 
            color={C.cyan} 
        />
    );
}
