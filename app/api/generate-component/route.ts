import { buildHeroComponent, HeroProps } from "@/lib/heroBuilder";
import { NextRequest, NextResponse } from "next/server";

 
export async function POST(request:NextRequest) {
  

    try {
    const body = await request.json();

    const { componentType, props } = body;

    if (!componentType) {
      return NextResponse.json(
        { error: "componentType is required" },
        { status: 400 }
      );
    }

    let responseData;

    switch (componentType.toLowerCase()) {
      case "hero":
        // props could be any object, so cast carefully or validate more strictly
        responseData = buildHeroComponent(props as HeroProps || {});
        break;

      // TODO: Add other components like CTA, FeatureGrid

      default:
        return NextResponse.json(
          { error: "Unsupported componentType" },
          { status: 400 }
        );
    }

    return NextResponse.json(responseData);
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid JSON or request body" },
      { status: 400 }
    );
  }
}